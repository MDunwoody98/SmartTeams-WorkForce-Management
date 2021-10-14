const {Schema, model} = require("mongoose");

const workerSchema = new Schema(
    {
        workerId: {
            type: String,
            required: [true, 'Worker ID is required'],
        },
        name: {
            firstName: {
                type: String,
                required: [true, 'Worker First Name is required'],
            },
            lastName: {
                type: String,
                required: [true, 'Worker Last Name is required'],
            },
            otherNames: {
                type: String,
                required: false
            }
        },
        
    },
    { timestamps: true },
);

module.exports = model('worker', workerSchema);