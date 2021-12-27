const {Schema, model} = require("mongoose");

const workerSchema = new Schema(
    {
        workerId: {
            type: String,
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
                        function(){
                            return this.phone_personal_mobile == null
                        },
                        'Worker personal home phone number is required if Worker personal mobile phone number is specified'
                    ],
                },
                phone_personal_mobile: {
                    type: String,
                    required: [
                        function(){
                            return this.phone_personal_home == null
                        },
                        'Worker personal mobile phone number is required if Worker personal home phone number is specified'
                    ],
                },
                phone_personal_work: {
                    type: String,
                    required: false,
                },
            },
            email: {
                email_personal: {
                    type: String,
                    required: [true,'Worker personal email is required'],
                },
                email_work: {
                    type: String,
                    required: false,
                },
            },
            worker_address: {
                address_line_1: {
                    type: String,
                    required: [true,'Address Line 1 is required'],
                },
                address_line_2: {
                    type: String,
                    required: false,
                },
                post_code: {
                    type: String,
                    required:  [true,'Post Code is required'],
                },
                city: {
                    type: String,
                    required: false,
                },
                country: {
                    type: String,
                    required: [true, 'country is required'],
                },
            },
        },
        position: {
            job_title: {
                type: String,
                required: [true, 'job title is required'],
            },
            management_level: {
                type: String,
                required: false,
            },
            department: {
                type: String,
                required: false,
            },
        },
    },
    { timestamps: true },
);

module.exports = model('worker', workerSchema);
//email/password/hire date/term date/supervisor ID/2fa/profile photo