const {Schema, model} = require("mongoose");

const time_entry_schema = new Schema(
    {
        workerId: {
            type: String,
            required: [true,'A worker must be linked to every time entry'],
        },
        date: {
            type: Date,
            required: [true, 'A valid date must be associated with every time entry'],
        },
        timeCodeId: {
            type: String,
            required: [true, 'Time entries must be linked to a valid time code'],
        },
        hours: {
            type: Number,
            validate: {
                validator: function(v) {
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
        approved: {
            type: Boolean,
            default: false
        }
    }
)
// On creation, all time codes must be in a state of NOT APPROVED
time_entry_schema.methods.createTimeCodeUnapproved = function() {
    this.approved = false;
}
time_entry_schema.queue('createTimeCodeUnapproved',[]);

module.exports = model('time_entry', time_entry_schema);