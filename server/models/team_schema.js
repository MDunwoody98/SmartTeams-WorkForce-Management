const {Schema, model} = require("mongoose");

const teamSchema = new Schema(
    {
        teamId: {
            type: String,
            required: [true, 'Team ID is required'],
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Team Name is required'],
        },
        managerId: {
            type: [String],
            required: [true, 'At least one worker must be assigned as a team manager'],
        },
        memberId: {
            type: [String],
            required: [true, 'At least one worker must be assigned as a team member'],
        },
        projectId: {
            type: [String],
            required: false,
        },
    }
)
module.exports = model('tean', teamSchema);