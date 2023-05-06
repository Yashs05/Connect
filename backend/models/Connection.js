const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConnectionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String
    },
    profilePicture: {
        type: String
    },
    connections: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            name: {
                type: String,
            },
            profilePicture: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    requestsReceived: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            name: {
                type: String,
            },
            profilePicture: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    requestsSent: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            name: {
                type: String,
            },
            profilePicture: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = Connection = mongoose.model('connection', ConnectionSchema)