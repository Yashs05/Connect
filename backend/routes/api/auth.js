const express = require('express')
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const router = express.Router()

// @route    GET api/auth
// @desc     Get logged in user
// @access   private

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')

        if(!user) {
            return res.status(404).json({ msg: 'No account found for this email. Please sign up first.' })
        }
        res.json(user)
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send({ msg: 'Server error' })
    }
})

// @route    POST api/auth
// @desc     Log in user
// @access   public

router.post('/', 
[
    check('email').isEmail(),
    check('password').not().isEmpty()
],
    async (req, res) => {
        
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: 'Please enter the correct details.' })
        }

        const { email, password } = req.body

        try {
            let user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ msg: 'The provided email is not registered. Please sign up first.' })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ msg: 'The details do not match. Please check your details.' })
            }

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
        } catch (err) {
            console.error(err.message)
            res.status(500).send({ msg: 'Server error' })
        }
    }
)

module.exports = router