import { Schema, model } from 'mongoose';
import { ISubmission } from './Submission';

export interface IAssignment {
    name: string,
    points: number,
    dueDate: Date,
    submissions?: Array<ISubmission>
};

const AssignmentSchema = new Schema<IAssignment>({
    name: { type: Schema.Types.String, required: true, match: [/^Fritter/, 'Assignment name must start with Fritter'] },
    points: { type: Schema.Types.Number, required: true, min: 0 },
    dueDate: { type: Schema.Types.Date, required: true }
}, {
    toObject: { virtuals: true, versionKey: false },
    toJSON: { virtuals: true, versionKey: false }
});

// (virtual-population)
// Auto-populate a Assignment.submissions field with any submissions are associated with this assignment such that Assignment._id === Submission.assignment._id
AssignmentSchema.virtual('submissions', {
    ref: 'Submission',
    localField: '_id',
    foreignField: 'assignment'
});

export default model('Assignment', AssignmentSchema);