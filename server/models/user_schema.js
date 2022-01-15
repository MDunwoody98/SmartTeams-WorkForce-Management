const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    workerId: {
        type: String,
        required: [true, 'Worker ID is required'],
        unique: true,
    },
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

module.exports = model('users', userSchema);