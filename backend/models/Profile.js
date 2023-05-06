const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    headline: {
        type: String,
        required: true
    },
    company: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    skills: {
        type: [String]
    },
    bio: {
        type: String
    },

    experience: [
        {
            title: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            location: {
                type: String
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: true
            },
            description: {
                type: String
            }
        }
    ],

    education: [
        {
            institution: {
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            field: {
                type: String
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: true
            },
            description: {
                type: String
            }
        }
    ],

    social: {
        linkedIn: {
            type: String
        },
        github: {
            type: String
        },
        stackoverflow: {
            type: String
        },
        youtube: {
            type: String
        },
        facebook: {
            type: String
        },
        website: {
            type: String
        }
    }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)