import {Schema, model, HydratedDocument} from 'mongoose';
import {IAssignment} from './Assignment';
import {IStudent} from './Student';

export interface ISubmission {
    assignment: IAssignment,
    date: Date,
    score: number,
    author: IStudent
}

const SubmissionSchema = new Schema<ISubmission>({
  assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  date: { type: Schema.Types.Date, required: true },
  score: { type: Schema.Types.Number, min: 0, validate: {
    validator: async function(this: HydratedDocument<ISubmission>, val: Number): Promise<boolean> {
        const res: HydratedDocument<ISubmission> = await this.populate('assignment');
        console.log(res, this)
        return val <= res.assignment.points;
    },
    message: props => `${props.value} must be lesser or equal to the assignment points.`
  }},
  author: { type: Schema.Types.ObjectId, ref: 'Student', required: true }
});

export default model('Submission', SubmissionSchema);