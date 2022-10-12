import {Schema, model} from 'mongoose';
import {ISubmission} from './Submission';

export interface IAssignment {
  name: string,
  points: number,
  submissions?: Array<ISubmission>
};

const AssignmentSchema = new Schema<IAssignment>({
  name: { type: String, required: true },
  points: { type: Number, required: true, min: 0 },
}, {
    toObject: {virtuals: true, versionKey: false},
    toJSON: {virtuals: true, versionKey: false}
});

// AssignmentSchema.virtual('submissions', {
//     ref: 'Submission',
//     localField: '_id',
//     foreignField: 'assignment'
// });

export default model('Assignment', AssignmentSchema);