import mongoose from 'mongoose';
import type { HydratedDocument } from 'mongoose';
import dotenv from 'dotenv';
import Student, {IStudent} from './models/Student';
import Assignment, { IAssignment } from './models/Assignment';
import Submission, {ISubmission} from './models/Submission';

dotenv.config();
mongoose.connect(process.env.MONGO_SRV?.replace('<password>', process.env.PASSWORD ?? '') ?? '')
    .then(
        () => {
            console.log('Succesfully connected to MongoDB.');
            main();
        },
        () => console.error('Failed to connect to MongoDB.')
    );
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function main() {
    const students: HydratedDocument<IStudent>[] = await Student.find({});
    const assignments: HydratedDocument<IAssignment>[] = await Assignment.find({});
    console.log('students', students.map(s => s.toObject({virtuals: true})));
    console.log('assignments', assignments.map(s => s.toObject({virtuals: true})));
}

const ben: HydratedDocument<IStudent> = new Student({ name: { first: 'Ben', last: 'Bitdiddle' }, year: 2023 });
const alyssa = new Student({ name: { first: 'Alyssa', middle: 'Processing', last: 'Hacker' }, year: 2025 });
const converge: HydratedDocument<IAssignment> = new Assignment({'name': 'Fritter Converge', points: 10});
const diverge: HydratedDocument<IAssignment> = new Assignment({'name': 'Fritter Diverge', points: 10});

async function makeAssignments() {
    const assignments = [
        converge, diverge
    ];
    for (const assignment of assignments) {
        await assignment.save();
        console.log(`Created assignment ${assignment.name}`);
    }
}

async function makeStudents() {
    const students = [
        ben, alyssa
    ];
    for (const student of students) {
        await student.save();
        console.log(`Created student ${student.name.full}`);
    }
}