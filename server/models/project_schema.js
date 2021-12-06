const {Schema, model} = require("mongoose");

const projectSchema = new Schema(
    {
        projectId: {
            type: String,
            required: [true, 'Project ID is required'],
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Project Name is required'],
        },
        managerId: {
            type: [String],
            required: [true, 'At least one worker must be assigned as project manager'],
        }
    }
)
module.exports = model('project', projectSchema);