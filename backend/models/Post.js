const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    image: {
        type: String
    },
    imagePublicId: {
        type: String
    },
    text: {
        type: String,
    },
    name: {
        type: String
    },
    profilePicture: {
        type: String
    },

    likes: [
        {
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
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],

    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            profilePicture: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Post = mongoose.model('post', PostSchema)