const {Schema, model} = require("mongoose");

const globalSettingsSchema = new Schema(
    {
        FTE_weekly: {
            type: Number,
            validate: {
                validator: function(v) {
                  return v % 0.25 == 0;
                },
                message: 'Weekly FTE must be provided in increments of 0.25 hours',
              },
            required: [true, 'Weekly FTE must be provided in increments of 0.25 hours'],
            min: 0,
            max: 48,
        },
        Annual_Leave_Allowance: {
            type: Number,
            validate: {
                validator: function(v) {
                  return v % 1 == 0;
                },
                message: 'Annual Leave allowance must be provided in increments of 1 day',
              },
            required: [true, 'Annual Leave allowance must be provided in increments of 1 day'],
            min: 28,
            max: 365,
        },
    }
)
module.exports = model(' globalSettings', globalSettingsSchema);