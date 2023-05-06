const express = require('express')
const fs = require('fs')
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')
require('dotenv').config()
const cloudinary = require('cloudinary').v2;

const Post = require('../../models/Post')
const User = require('../../models/User')

const router = express.Router()

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

// @route    POST api/posts
// @desc     Add a post
// @access   Private

router.post('/', auth,
    async (req, res) => {

        const { text } = req.body

        const image = req.files?.image

        if (!text && !image) {
            return res.status(400).json({ msg: 'Please provide an image or text to post.' })
        }

        try {
            // Get user
            const user = await User.findById(req.user.id)

            // Create postFields object
            const postFields = {}

            postFields.user = req.user.id
            postFields.name = user.name
            postFields.profilePicture = user.profilePicture
            if (text) postFields.text = text

            if (image) {

                if (fs.statSync(image.tempFilePath).size / (1024 * 1024) > 1) {
                    fs.unlink(image.tempFilePath, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log('Local file deleted successfully.');
                    });
                    return res.status(400).json({ msg: 'Image size cannot be more than 1mb.' })
                }

                const imageURL = await cloudinary.uploader.upload(image.tempFilePath)

                fs.unlink(image.tempFilePath, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Local file deleted successfully.');
                });

                postFields.image = imageURL.secure_url
                postFields.imagePublicId = imageURL.public_id
            }

            // Create new Post
            let newPost = new Post(postFields)

            await newPost.save()

            res.json(newPost)

        } catch (err) {
            console.error(err.message)
            res.status(500).json({ msg: 'Server error' })
        }
    }
)

// @route    GET api/posts
// @desc     Get all posts
// @access   Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)

    } catch (err) {
        console.error(err.message)
        res.status(500).json({ msg: 'Server error' })
    }
})

router.get('/:id', auth, async (req, res) => {

    try {
        const posts = await Post.find({ user: req.params.id })

        if (!posts) {
            return res.status(404).json({ msg: 'Post not found.' })
        }

        res.json(posts)

    } catch (err) {
        console.error(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found.' })
        }

        res.status(500).json({ msg: 'Server error' })
    }
})

// @route    DELETE api/posts/deletepost/:id
// @desc     Delete post by id
// @access   Private

router.delete('/deletepost/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ msg: 'Post not found.' })
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "You cannot delete any other user's post." })
        }

        if (post.image) {
            await cloudinary.uploader.destroy(post.imagePublicId, function (result) { console.log(result) });
        }

        await post.remove()

        res.status(200).json({ msg: 'Your post was deleted successfully.' })

    } catch (err) {
        console.error(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found.' })
        }

        res.status(500).json({ msg: 'Server error' })
    }
})

// @route PUT api/posts/likepost/:id
// @desc Like post by id
// @access Private

router.put('/likepost/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ msg: 'Post not found.' })
        }

        // Check if post is already liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length) {
            return res.status(400).json({ msg: 'You have already liked this post.' })
        }

        const newLike = {
            name: user.name,
            profilePicture: user.profilePicture,
            user: req.user.id
        }

        // Add like
        post.likes.unshift(newLike)

        await post.save()

        res.json(post.likes)

    } catch (err) {
        console.error(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found.' })
        }

        res.status(500).json({ msg: 'Server error' })
    }
})

// @route    PUT api/posts/unlikepost/:id
// @desc     Unlike post by id
// @access   Private

router.put('/unlikepost/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ msg: 'Post not found.' })
        }

        // Check if post is already unliked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'You cannot unlike this post unless you like it.' })
        }

        // Get removing index
        const removingIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

        // Remove like
        post.likes.splice(removingIndex, 1)

        await post.save()

        res.json(post.likes)

    } catch (err) {
        console.error(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found.' })
        }

        res.status(500).json({ msg: 'Server error' })
    }
})

// @route    PUT api/posts/addcomment/:id
// @desc     Add comment
// @access   Private

router.put('/addcomment/:id', [auth, [
    check('text', 'Please add a comment.').not().isEmpty()
]],
    async (req, res) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array() })
        }

        try {
            const user = await User.findById(req.user.id)
            const post = await Post.findById(req.params.id)

            if (!post) {
                return res.status(404).json({ msg: 'Post not found.' })
            }

            const newComment = {
                text: req.body.text,
                name: user.name,
                profilePicture: user.profilePicture,
                user: req.user.id
            }

            post.comments.unshift(newComment)

            await post.save()

            res.json(post.comments)

        } catch (err) {
            console.error(err.message)

            if (err.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Post not found.' })
            }

            res.status(500).json({ msg: 'Server error' })
        }
    }
)

// @route    PUT api/posts/deletecomment/:id/:comment_id
// @desc     Delete comment
// @access   Private

router.put('/deletecomment/:id/:comment_id', auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ msg: 'Post not found.' })
        }

        // Get comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found.' })
        }

        // Check user
        if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
            return res.status(401).json("You cannot delete any other user's comment.")
        }

        // Get removing index
        const removingIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)

        // Delete comment
        post.comments.splice(removingIndex, 1)

        await post.save()

        res.json(post.comments)

    } catch (err) {
        console.error(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found.' })
        }

        res.status(500).json({ msg: 'Server error' })
    }
})

module.exports = router