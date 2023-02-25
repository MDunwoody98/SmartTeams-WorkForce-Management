const { Schema, model } = require("mongoose");

const time_code_schema = new Schema(
    {
        projectId: {
            type: String,
            required: true, //All time codes require a project
        },
        timeCodeName: {
            type: String,
            required: true, //All time codes need a name
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
        utilised: {
            type: Boolean,
            required: [true, 'It must be stated whether this time code is utilised'],
        },
        billed: {
            type: Boolean,
            required: [true, 'It must be stated whether this time code is billable'],
        }
    }
)
module.exports = model('time_code', time_code_schema);