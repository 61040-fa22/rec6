import dotenv from 'dotenv';

// mongoose imports
import mongoose from 'mongoose';
import type { HydratedDocument } from 'mongoose';

// models and type imports
import Student, { IStudent } from './models/Student';
import Assignment, { IAssignment } from './models/Assignment';
import Submission, { ISubmission } from './models/Submission';

// Load environment vairables from dotenv
dotenv.config();
mongoose.connect(process.env.MONGO_SRV?.replace('<password>', process.env.PASSWORD ?? '') ?? '')
    .then(
        () => {
            console.log('Succesfully connected to MongoDB.');
            queryDatabase();
        },
        () => console.error('Failed to connect to MongoDB.')
    );
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
// gracefully handle promise rejections
process.on('unhandledRejection', console.error);

/**
 * Find all student, assignment, and submission data from the database.
 */
async function findAll() {
    const students: HydratedDocument<IStudent>[] = await Student.find({});
    const assignments: HydratedDocument<IAssignment>[] = await Assignment.find({});
    const submissions: HydratedDocument<ISubmission>[] = await Submission.find({});
    console.log('students', students.length);
    console.log('assignments', assignments.length);
    console.log('submissions', await Promise.all(
        submissions.map((s: HydratedDocument<ISubmission>) => s.populate<{ author: IStudent, assignment: IAssignment }>(['author', 'assignment']).then(m => [m.assignment.name, m.author.name.full, m.score])))
    );
}

async function queryDatabase() {
    await findAll();
    // await addStudent();
    // await addSubmission();
    // await gradeSubmission();
    // await findUpperclassmen();
}

/**
 * SOLN: Find students that are upperclassmen.
 */
async function findUpperclassmen() {
    const upperclassmen = await Student.find({ year: { $lte: 2024 } });
    console.log('upperclassmen', upperclassmen);
}

/**
 * SOLN: Add a student named Daniel Nicholas Jackson Jr. with class year 3000.
 * - Set his year to something that's actually a valid value, then save().
 */
async function addStudent() {
    const student = new Student({ name: { first: 'Daniel', middle: 'Nicholas', last: 'Jackson Jr.' }, year: 2024 });
    await student.save();
    console.log('new student', student);
}

/**
 * SOLN: Add a submission by author Daniel N. Jackson Jr. for assignment Fritter Diverge, current date, with no score.
 */
async function addSubmission() {
    const diverge = await Assignment.findOne({ name: 'Fritter Diverge' });
    const daniel = await Student.findOneAndUpdate({ name: { first: 'Daniel', middle: 'Nicholas', last: 'Jackson Jr.' }});
    const submission = new Submission({
        assignment: diverge,
        author: daniel,
        date: new Date()
    });
    submission.save();
    console.log('new submission', submission);
}

/**
 * SOLN: Grade Daniel N. Jackson's submission for Fritter Converge.
 */
async function gradeSubmission() {
    const diverge = await Assignment.findOne({ name: 'Fritter Diverge' });
    const daniel = await Student.findOne({ name: { first: 'Daniel', middle: 'Nicholas', last: 'Jackson Jr.' }});
    const gradedSubmission = await Submission.findOneAndUpdate({assignment: diverge, author: daniel}, {score: 10}, {returnDocument: 'after'});
    console.log('graded submission', gradedSubmission);
}

// DO NOT EDIT ANYTHING BELOW THIS LINE,
// NOT PART OF RECITATION
// (but feel free to reference)

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
    const converge: HydratedDocument<IAssignment> = new Assignment({ 'name': 'Fritter Converge', points: 10, dueDate: new Date('9/30/2022 0:00') });
    const diverge: HydratedDocument<IAssignment> = new Assignment({ 'name': 'Fritter Diverge', points: 10, dueDate: new Date('10/12/2022 0:00') });

    async function makeSubmissions() {
        const submission1 = new Submission({
            assignment: diverge, date: new Date('9/29/2022 23:59'), score: 9.5, author: ben
        });
        const submission2 = new Submission({
            assignment: diverge, date: new Date('9/28/2022 1:00'), score: 8.25, author: alyssa
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