import {Schema, model} from 'mongoose';
import {ISubmission} from './Submission';

export interface IAssignment {
  name: string,
  points: number,
  dueDate: Date,
  submissions?: Array<ISubmission>
};

const AssignmentSchema = new Schema<IAssignment>({
  name: { type: Schema.Types.String, required: true },
  points: { type: Schema.Types.Number, required: true, min: 0 },
  dueDate: { type: Schema.Types.Date, required: true }
}, {
    toObject: {virtuals: true, versionKey: false},
    toJSON: {virtuals: true, versionKey: false}
});

AssignmentSchema.virtual('submissions', {
    ref: 'Submission',
    localField: '_id',
    foreignField: 'assignment'
});

export default model('Assignment', AssignmentSchema);