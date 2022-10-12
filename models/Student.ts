import {Schema, model} from 'mongoose';

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
      set: (string: string) => string.charAt(0).toUpperCase() + '.'
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
    toObject: {virtuals: true, versionKey: false},
    toJSON: {virtuals: true, versionKey: false}
});

StudentSchema.virtual('name.full').get(function() {
    const names = [this.name.first, this.name.last];
    if (this.name.middle) names.splice(1, 0, this.name.middle);
    return names.join(' ');
}).set(function(v) {
    const [first, middle, last] = v.split(' ');
    this.name = {first, middle, last};
});

export default model('Student', StudentSchema);