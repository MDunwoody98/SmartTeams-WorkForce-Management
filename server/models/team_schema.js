const {Schema, model} = require("mongoose");
const mongoose = require("mongoose")
const AutoIncrement = require('mongoose-sequence')(mongoose);

const teamSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Team Name is required'],
            unique: true,
        },
        managerId: {
            type: [Number],
            required: [true, 'At least one worker must be assigned as a team manager'],
            validate: {
                validator: (v) => v.length > 0
            },
        },
        memberId: {
            type: [Number],
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
teamSchema.plugin(AutoIncrement, {inc_field: 'teamId'});
module.exports = model('team', teamSchema);