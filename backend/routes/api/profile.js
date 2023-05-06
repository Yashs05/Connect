const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const { check, validationResult } = require('express-validator')

// @route    GET api/profile
// @desc     Get current user profile
// @access   private

router.get('/', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['-password'])

        if (!profile) {
            return res.status(400).json({ msg: "You do not have a profile set up currently" })
        }

        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send({ msg: 'Server error' })
    }
})

// @route    POST api/profile
// @desc     Create or update profile
// @access   private

router.post('/', [auth, [
    check('status').not().isEmpty(),
    check('headline').isLength({ min: 15 }),
    check('location').not().isEmpty()
]],
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: 'Please enter the correct details.' })
        }

        const {
            status,
            headline,
            location,
            company,
            skills,
            bio,
            linkedIn,
            github,
            stackoverflow,
            website,
            youtube,
            facebook,
        } = req.body

        // Build profile object
        const profileFields = {}

        profileFields.user = req.user.id

        if (status) profileFields.status = status
        if (headline) profileFields.headline = headline
        if (location) profileFields.location = location
        if (company) profileFields.company = company
        if (bio) profileFields.bio = bio

        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim())
        }

        // Build social object
        profileFields.social = {}

        if (linkedIn) profileFields.social.linkedIn = linkedIn
        if (github) profileFields.social.github = github
        if (stackoverflow) profileFields.social.stackoverflow = stackoverflow
        if (website) profileFields.social.website = website
        if (youtube) profileFields.social.youtube = youtube
        if (facebook) profileFields.social.facebook = facebook

        try {
            let profile = await Profile.findOne({ user: req.user.id })

            if (profile) {
                // Update profile
                profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true }).populate('user', ['-password'])

                return res.json(profile)
            }

            // Create Profile if required
            profile = new Profile(profileFields)

            await profile.save()

            await profile.populate('user', ['-password'])

            return res.json(profile)

        } catch (err) {
            console.error(err.message)
            res.status(500).send({ msg: 'Server error' })
        }
    }
)

// @route    GET api/profile/allprofiles
// @desc     Get all user's profiles
// @access   Public

router.get('/allprofiles', async (req, res) => {

    const keyword = req.query.search

    try {
        let profiles;
        if (keyword) {
            profiles = await Profile.find().select('status headline location').populate({
                path: 'user',
                select: 'name profilePicture',
                match: { name: { $regex: keyword, $options: 'i' } }
            })

            profiles = profiles.filter(profile => profile.user !== null)
        }
        else {
            profiles = await Profile.find().select('status headline location').populate('user', ['name', 'profilePicture'])
        }
        res.json(profiles)

    } catch (err) {
        console.error(err.message)
        res.status(500).send({ msg: 'Server error' })
    }
})

// @route GET api/profile/:user_id
// @desc Get user's profile by id
// @access Public

router.get('/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['-password'])

        if (!profile) {
            return res.status(400).json({ msg: 'No user found' })
        }

        res.json(profile)

    } catch (err) {
        console.error(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'No user found' })
        }
        res.status(500).send({ msg: 'Server error' })
    }
})

// @route DELETE api/profile/deleteprofile
// @desc Delete profile
// @access Private

router.delete('/deleteprofile', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        if (!profile) {
            return res.status(400).json({ msg: 'Your profile does not exist or it has been already deleted' })
        }

        await Profile.findOneAndRemove({ user: req.user.id })

        res.json({ msg: 'Your profile has been deleted successfully.' })

    } catch (err) {
        console.error(err.message)
        res.status(500).send({ msg: 'Server error' })
    }
})

// @route PUT api/profile/addexperience
// @desc Add or update experience
// @access Private

router.put('/addexperience', [auth, [
    check('title').not().isEmpty(),
    check('type').not().isEmpty(),
    check('company').not().isEmpty(),
    check('location').not().isEmpty(),
    check('from').not().isEmpty()
]],
    async (req, res) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: 'Please enter the correct details.' })
        }

        const { title, type, company, location, from, to, current, description } = req.body

        const experience = { title, type, company, location, from, to, current, description }

        try {
            const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['-password'])

            if (!profile) {
                return res.status(400).json({ msg: 'You do not have a profile set up currently' })
            }

            profile.experience.unshift(experience)

            await profile.save()

            res.json(profile)

        } catch (err) {
            console.error(err.message)
            res.status(500).send({ msg: 'Server error' })
        }
    }
)

// @route DELETE api/profile/deleteexperience/:exp_id
// @desc Delete experience
// @access Private

router.put('/deleteexperience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['-password'])

        if (!profile) {
            return res.status(400).json({ msg: 'You do not have a profile set up currently' })
        }

        // Get experience id to be deleted
        const deletingExpId = profile.experience.map(exp => exp.id).indexOf(req.params.exp_id)

        profile.experience.splice(deletingExpId, 1)

        await profile.save()

        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send({ msg: 'Server error' })
    }
})

// @route PUT api/profile/addeducation
// @desc Add or update education
// @access Private

router.put('/addeducation', [auth, [
    check('institution', 'Institution is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('from', 'Start date is required').not().isEmpty()
]],
    async (req, res) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: 'Please enter the correct details.' })
        }

        const { institution, degree, field, from, to, current, description } = req.body

        const education = { institution, degree, field, from, to, current, description }

        try {
            const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['-password'])

            if (!profile) {
                return res.status(400).json({ msg: 'You do not have a profile set up currently' })
            }

            profile.education.unshift(education)

            await profile.save()

            res.json(profile)

        } catch (err) {
            console.error(err.message)
            res.status(500).send({ msg: 'Server error' })
        }
    }
)

// @route DELETE api/profile/deleteeducation/:edu_id
// @desc Delete education
// @access Private

router.put('/deleteeducation/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['-password'])

        if (!profile) {
            return res.status(400).json({ msg: 'You do not have a profile set up currently' })
        }

        // Get removing index
        const deletingEduId = profile.education.map(edu => edu.id).indexOf(req.params.edu_id)

        // Remove education
        profile.education.splice(deletingEduId, 1)

        await profile.save()

        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send({ msg: 'Server error' })
    }
})

module.exports = router