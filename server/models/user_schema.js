const { Schema, model } = require('mongoose');
const mongoose = require("mongoose")
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new Schema(
  {
    password: {
        type: String,
        required: [true, 'Password is required'],
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