const {Schema, model} = require("mongoose");

const time_code_schema = new Schema(
    {
        time_code_id: {
            type: String,
            required: [true, 'Time Code ID is required'],
            unique: true,
        },
        projectId: {
            type: String,
            required: false, //Not all time codes are for a project
        },
        autoApprove: {
            type: Boolean,
            required: [true, 'It must be stated whether this time code requires approval'],
        },
        approvalByTeamManager: {
            type: Boolean,
            required: [true, 'It must be stated whether this time code is approved by team managers'],
        },
        approvalByProjectManager: {
            type: Boolean,
            required: [true, 'It must be stated whether this time code is approved by project managers'],
        },
        utilized: {
            type: Boolean,
            required: [true, 'It must be stated whether this time code is utilized'],
        },
        billed: {
            type: Boolean,
            required: [true, 'It must be stated whether this time code is billable'],
        }
    }
)
module.exports = model('time_code', time_code_schema);