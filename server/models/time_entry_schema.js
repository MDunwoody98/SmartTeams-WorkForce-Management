const { Schema, model } = require("mongoose");

const time_entry_schema = new Schema(
    {
        workerId: {
            type: Number,
            required: [true, 'A worker must be linked to every time entry'],
        },
        date: {
            type: Date,
            required: [true, 'A valid date must be associated with every time entry'],
        },
        // Time entry must have either a time code or time off code ID
        timeCodeId: {
            type: String,
            required: function () {
                return this.timeOffCodeId == null
            },
        },
        timeOffCodeId: {
            type: String,
            required: function () {
                return this.timeCodeId == null
            },
        },
        hours: {
            type: Number,
            validate: {
                validator: function (v) {
                    return v % 0.25 == 0;
                },
                message: 'Time worked must be provided in increments of 0.25 hours',
            },
            required: [true, 'Time worked must be provided in increments of 0.25 hours'],
            min: 0.25,
            max: 24,

        },
        comments: {
            type: String,
            required: false,
        },
        submitted: {
            type: Boolean,
            default: false
        },
        approved: {
            type: Boolean,
            default: false
        },
        approvalDate: {
            type: Date,
            required: false,
        },
        approverId: {
            type: String,
            required: false,
        },
        rejected: {
            type: Boolean,
            default: false
        },
        rejectionMessage: {
            type: Boolean,
            required: false,
        },
    },
    { timestamps: true }
)
// On creation, all time entries must be in draft - a state of NOT APPROVED, NOT SUBMITTED, and NOT REJECTED
time_entry_schema.methods.createTimeEntryBlank = function () {
    this.approved = false;
    this.submitted = false;
    this.rejected = false;
}
time_entry_schema.queue('createTimeEntryBlank', []);

module.exports = model('time_entry', time_entry_schema);