import { Schema, model } from 'mongoose';
import type { Types } from 'mongoose';

export interface ISubmission {
    assignment: Types.ObjectId,
    date: Date,
    score: number,
    author: Types.ObjectId
}

const SubmissionSchema = new Schema<ISubmission>({
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    date: { type: Schema.Types.Date, required: true },
    score: { type: Schema.Types.Number, min: 0 },
    author: { type: Schema.Types.ObjectId, ref: 'Student', required: true }
}, {
    toObject: { virtuals: true, versionKey: false },
    toJSON: { virtuals: true, versionKey: false }
});

SubmissionSchema.index({ assignment: 1, author: 1 }, { unique: true });

export default model('Submission', SubmissionSchema);