import { Schema, model } from 'mongoose';

export interface IStudent {
    name: {
        first: string,
        last: string,
        middle?: string,
        full?: string
    },
    year: Number
};

const StudentSchema = new Schema<IStudent>({
    name: {
        first: {
            type: Schema.Types.String,
            required: true,
            set: (string: string) => string.charAt(0).toUpperCase() + string.slice(1)
        },
        middle: {
            type: Schema.Types.String,
            set: (string: string) => string.charAt(0).toUpperCase() + string.slice(1),
            get: (v: string) => v ? v.charAt(0) + '.' : ''
        },
        last: {
            type: Schema.Types.String,
            required: true,
            set: (string: string) => string.charAt(0).toUpperCase() + string.slice(1)
        },
    },
    year: {
        type: Schema.Types.Number,
        required: true,
        min: [2023, 'Student cannot be an alumni'],
        max: [2026, 'Student cannot be a prefrosh or future student']
    }
}, {
    toObject: { virtuals: true, versionKey: false },
    toJSON: { virtuals: true, versionKey: false }
});

StudentSchema.index({ 'name.first': 1, 'name.middle': 1, 'name.last': 1 }, { unique: true });

// TODO: Add a full name virtual property
StudentSchema.virtual('name.full')
    // Getter must be able to translate stored properties into a formatted string, e.g. Ben Bitdiddle or Daniel N. Jackson
    .get(function () {
        // Hint: Reference attributes on `this`!
    })
    // Setter must be able to compute stored properties based on single string parameter
    .set(function (v: string) {
        // Hint: Do something with v!
    });

export default model('Student', StudentSchema);