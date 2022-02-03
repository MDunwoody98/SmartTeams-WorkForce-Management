const {Schema, model} = require("mongoose");

const teamSchema = new Schema(
    {
        teamId: {
            type: String,
            required: false,
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Team Name is required'],
        },
        managerId: {
            type: [String],
            required: [true, 'At least one worker must be assigned as a team manager'],
            validate: {
                validator: (v) => v.length > 0
            },
        },
        memberId: {
            type: [String],
            required: [true, 'At least one worker must be assigned as a team member'],
            validate: {
                validator: (v) => v.length > 0
            },
        },
        projectId: {
            type: [String],
            required: false,
        },
        timeOffCodeId: {
            type: [String],
            required: false //Not all teams need linked time off codes. Worker may be part of global organization-wide team that manages time-offs
        },
    }
)
module.exports = model('team', teamSchema);