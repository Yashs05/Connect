// Packages
const express = require('express')
const fs = require('fs')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;

const auth = require('../../middleware/auth')

// Models
const User = require('../../models/User')
const Profile = require('../../models/Profile')
const Post = require('../../models/Post')
const Connection = require('../../models/Connection')

const router = express.Router()

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

// @route    POST api/users
// @desc     Register user
// @access   Public

router.post('/', [
    check('name').trim().not().isEmpty(),

    check('email').isEmail(),

    check('password').matches(/^(?=.*\d)(?=.*[a-zA-Z]).{6,15}$/)
],
    async (req, res) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: 'Please enter the correct details.' })
        }

        const { name, email, password } = req.body

        const profilePicture = req.files?.profilePicture

        try {
            // Check if user exists
            let user = await User.findOne({ email })

            if (user) {
                return res.status(400).json({ msg: 'Email provided is already registered.' })
            }

            // Check if photo is sent or not
            if (profilePicture) {

                if (fs.statSync(profilePicture.tempFilePath).size / (1024 * 1024) > 1) {
                    fs.unlink(profilePicture.tempFilePath, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log('Local file deleted successfully');
                    });

                    return res.status(400).json({ msg: 'Image size cannot be more than 1mb.' })
                }

                const profilePictureURL = await cloudinary.uploader.upload(profilePicture.tempFilePath)

                fs.unlink(profilePicture.tempFilePath, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });

                // Create user instance with photo
                user = new User({
                    name,
                    email,
                    password,
                    profilePicture: profilePictureURL.secure_url,
                    profilePicturePublicID: profilePictureURL.public_id
                })
            }
            else {
                // Create user instance with default photo
                user = new User({
                    name,
                    email,
                    password
                })
            }

            // Encrypt password
            const salt = await bcrypt.genSalt(10)

            user.password = await bcrypt.hash(password, salt)

            // Save user to database
            await user.save()

            // Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload,
                process.env.JWT_SECRET,
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                })
        }
        catch (err) {
            console.error(err.message)
            res.status(500).send({ msg: 'Server error' })
        }
    }
)

// @route    PUT api/users
// @desc     Edit user
// @access   Private

router.put('/', auth, [
    check('password').trim().not().isEmpty()
],
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: 'Please enter your current password.' })
        }

        const { name, password, newPassword } = req.body

        const profilePicture = req.files?.profilePicture

        try {
            let user = await User.findById(req.user.id)

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ msg: 'Incorrect password.' })
            }

            const userFields = {}

            if (name) {
                if (!name.trim()) {
                    return res.status(400).json({ msg: 'Please provide a valid name.' })
                }
                userFields.name = name.trim()
            }

            if (newPassword) {
                if (!/^(?=.*\d)(?=.*[a-zA-Z]).{6,15}$/.test(newPassword)) {
                    return res.status(400).json({ msg: 'Please provide a valid password.' })
                }
                // Encrypt password
                const salt = await bcrypt.genSalt(10)
                userFields.password = await bcrypt.hash(newPassword, salt)
            }

            if (profilePicture) {
                if (fs.statSync(profilePicture.tempFilePath).size / (1024 * 1024) > 1) {
                    fs.unlink(profilePicture.tempFilePath, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });

                    return res.status(400).json({ msg: 'Image size cannot be more than 1mb.' })
                }

                const profilePictureURL = await cloudinary.uploader.upload(profilePicture.tempFilePath)

                fs.unlink(profilePicture.tempFilePath, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Local file deleted successfully');
                });

                userFields.profilePicture = profilePictureURL.secure_url
                userFields.profilePicturePublicID = profilePictureURL.public_id
            }
            else {
                userFields.profilePicture = 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                userFields.profilePicturePublicID = ''
            }

            if (user.profilePicture !== 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg') {
                await cloudinary.uploader.destroy(user.profilePicturePublicID, function (result) { console.log(result) });
            }

            user = await User.findByIdAndUpdate(req.user.id, { $set: userFields }, { new: true }).select('-password')

            await user.save()

            res.status(200).json(user)
        }
        catch (err) {
            console.error(err.message)
            res.status(500).send({ msg: 'Server error' })
        }
    }
)

// @route    DELETE api/users/deleteuser
// @desc     Delete user (delete everything related to user)
// @access   Private

router.post('/deleteuser', auth, [
    check('password').trim().not().isEmpty()
],
    async (req, res) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: 'Please provide your password.' })
        }

        const { password } = req.body

        try {
            const user = await User.findById(req.user.id)

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ msg: 'Incorrect password.' })
            }

            await User.findByIdAndRemove(req.user.id)
            await Profile.findOneAndRemove({ user: req.user.id })
            await Post.deleteMany({ user: req.user.id })
            await Connection.findByIdAndRemove(req.user.id)

            res.json({ msg: 'Your account has been deleted successfully.' })
        }
        catch (err) {
            res.status(500).json({ msg: 'Server error' })
        }

    })

module.exports = router