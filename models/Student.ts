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
        // SOLN: Add getters and setters for a middle name property
        middle: {
            type: Schema.Types.String,
            // SOLN: Setter to capitalize first letter of middle name only
            set: (string: string) => string.charAt(0).toUpperCase() + string.slice(1),
            // SOLN: Getter to only return the capitalized first initial (e.g. Nicholas -> N.)
            get: (v: string) => v ? v.charAt(0).toUpperCase() + '.' : '',
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
        min: 2023,
        max: 2026
    }
}, {
    toObject: { virtuals: true, versionKey: false },
    toJSON: { virtuals: true, versionKey: false }
});

StudentSchema.index({ 'name.first': 1, 'name.middle': 1, 'name.last': 1 }, { unique: true });

// SOLN: Add a full name virtual property
StudentSchema.virtual('name.full')
    // Getter must be able to translate stored properties into a formatted string, e.g. Ben Bitdiddle or Daniel N. Jackson
    .get(function () {
        const names = [this.name.first, this.name.last];
        if (this.name.middle) names.splice(1, 0, this.name.middle);
        return names.join(' ');
    // Setter must be able to compute stored properties based on single string parameter
    }).set(function (v: string) {
        const [first, middle, last] = v.split(' ');
        this.name = { first, middle, last };
    });

export default model('Student', StudentSchema);