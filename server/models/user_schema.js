const { Schema, model } = require('mongoose');
const mongoose = require("mongoose")
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new Schema(
  {
    password: {
        type: String,
        required: [true, 'Password is required'],
        // Password regex validation
        validate: {
          validator: (v) => /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v)
      },
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  { timestamps: true },
);

userSchema.plugin(AutoIncrement, {inc_field: 'workerId'});
module.exports = model('users', userSchema);