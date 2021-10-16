const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    workerId: {
      type: String,
      required: [true, 'Worker ID is required'],
    },
    password: {
      type: Number,
      required: [true, 'Password is required'],
    },
  },
  { timestamps: true },
);

module.exports = model('users', userSchema);