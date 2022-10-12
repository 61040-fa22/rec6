import mongoose from 'mongoose';
import type { HydratedDocument } from 'mongoose';
import dotenv from 'dotenv';
import Student, { IStudent } from './models/Student';
import Assignment, { IAssignment } from './models/Assignment';
import Submission, { ISubmission } from './models/Submission';

dotenv.config();
mongoose.connect(process.env.MONGO_SRV?.replace('<password>', process.env.PASSWORD ?? '') ?? '')
    .then(
        () => {
            console.log('Succesfully connected to MongoDB.');
            findAll();
        },
        () => console.error('Failed to connect to MongoDB.')
    );
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**
 * Find all student, assignment, and submission data from the database.
 */
async function findAll() {
    const students: HydratedDocument<IStudent>[] = await Student.find({});
    const assignments: HydratedDocument<IAssignment>[] = await Assignment.find({});
    const submissions: HydratedDocument<ISubmission>[] = await Submission.find({});
    console.log('students', students.map(s => s.toJSON()));
    console.log('assignments', assignments.map(s => s.toJSON()));
    console.log('submissions', await Promise.all(submissions.map((s: HydratedDocument<ISubmission>) => s.populate<{ author: IStudent, assignment: IAssignment }>(['author', 'assignment']))));
}

/**
 * Clear and re-populate database.
 * NOTE TO TAs: RUN AFTER EVERY RECITATION.
 */
async function repopulate() {
    console.log('Clearing database...');
    await Student.deleteMany({});
    await Assignment.deleteMany({});
    await Submission.deleteMany({});

    const ben: HydratedDocument<IStudent> = new Student({ name: { first: 'Ben', last: 'Bitdiddle' }, year: 2023 });
    const alyssa = new Student({ name: { first: 'Alyssa', middle: 'Processing', last: 'Hacker' }, year: 2025 });
    const converge: HydratedDocument<IAssignment> = new Assignment({ 'name': 'Fritter Converge', points: 10 });
    const diverge: HydratedDocument<IAssignment> = new Assignment({ 'name': 'Fritter Diverge', points: 10 });

    async function makeSubmissions() {
        const submission1 = new Submission({
            assignment: diverge, date: new Date('9/29/2022 23:59'), score: 9.5, author: ben
        });
        const submission2 = new Submission({
            assignment: diverge, date: new Date('9/28/2022 1:00'), score: 9, author: alyssa
        });
        const submission3 = new Submission({
            assignment: converge, date: new Date(), author: alyssa
        });
        const submission4 = new Submission({
            assignment: converge, date: new Date('10/11/2022 23:59'), author: ben
        });
        const submissions = [
            submission1,
            submission2,
            submission3,
            submission4
        ];
        for (const submission of submissions) {
            await submission.save();
            const s = await submission.populate<{ author: IStudent, assignment: IAssignment }>(['author', 'assignment']);
            console.log(`Created submission on assignment ${s.assignment.name} by ${s.author.name.full}`);
        }
    }

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

    await makeStudents();
    await makeAssignments();
    await makeSubmissions();
    console.log('Repopulated database.');
}