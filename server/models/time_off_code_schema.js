const {Schema, model} = require("mongoose");

const time_off_code_schema = new Schema(
    {
        timeOffCodeName: {
            type: String,
            required: true, //All time offs need a name
            unique: true, // Time Off Codes must have a unique name
        },
        autoApprove: {
            type: Boolean,
            default: false,
        },
        paid: {
            type: Boolean,
            required: [true, 'It must be stated whether this time off is paid'],
        },
        requiresMultipleApprovals: {
            type: Boolean,
            default: false, //By default, time entries only require approval from the lead of one Team in which the worker is a member
        },
    }
)
module.exports = model('time_off_code', time_off_code_schema);