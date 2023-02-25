const { Schema, model } = require("mongoose");

const workerSchema = new Schema(
    {
        workerId: {
            type: Number,
            required: [true, 'Worker ID is required'],
            unique: true,
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
            },
        },
        contact: {
            phone: {
                phone_personal_home: {
                    type: String,
                    required: [
                        function () {
                            return this.phone_personal_mobile != null
                        },
                        'Worker personal home phone number is required if Worker personal mobile phone number is not specified'
                    ],
                },
                phone_personal_mobile: {
                    type: String,
                    required: [
                        function () {
                            return this.phone_personal_home != null
                        },
                        'Worker personal mobile phone number is required if Worker personal home phone number is not specified'
                    ],
                },
                phone_work: {
                    type: String,
                    required: false,
                    unique: true,
                    sparse: true,
                },
            },
            email: {
                email_personal: {
                    type: String,
                    required: [true, 'Worker personal email is required'],
                    // Email regex validation
                    validator: (v) => {
                        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                        return emailRegex.test(v);
                    }
                },
                email_work: {
                    type: String,
                    required: false,
                    unique: true,
                    sparse: true,
                },
            },
        },
        position: {
            job_title: {
                type: String,
                required: [true, 'job title is required'],
            },
        },
        photo: {
            type: String,
            required: false,
        }
    },
    { timestamps: true },
);

module.exports = model('worker', workerSchema);
//email/password/hire date/term date/2fa/address/department/management level