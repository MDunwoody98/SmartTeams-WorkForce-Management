const { Schema, model } = require("mongoose");

const projectSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Project Name is required'],
            unique: true,
        },
        managerId: {
            type: [Number],
            required: [true, 'At least one worker must be assigned as a team manager'],
            validate: {
                validator: (v) => v.length > 0
            },
        },
        startDate: {
            type: Date,
            required: false,
        },
        endDate: {
            type: Date,
            required: false,
        }
    }
)
module.exports = model('project', projectSchema);