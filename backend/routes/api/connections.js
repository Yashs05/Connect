const express = require('express')
const auth = require('../../middleware/auth')

const User = require('../../models/User')
const Connection = require('../../models/Connection')
const Profile = require('../../models/Profile')

const router = express.Router()

// @route api/connections/sendrequest/:user_id
// @desc Send connection request
// @access Private

router.post('/sendrequest/:user_id', auth, async (req, res) => {
    try {
        // Ensure request is not sent to itself
        if (req.user.id === req.params.user_id) {
            return res.status(400).json({ msg: 'You cannot send connection request to yourself' })
        }

        // Get user connection
        let connection = await Connection.findOne({ user: req.user.id })

        // Get user
        const user = await User.findById(req.user.id)

        // Get receiver user
        const receiverUser = await User.findById(req.params.user_id)

        if (!receiverUser) {
            return res.status(404).json({ msg: 'No user found' })
        }

        // Check if connection exists and create a new if required
        if (!connection) {
            // Build an empty connection document
            const connectionFields = {}

            connectionFields.user = user.id
            connectionFields.name = user.name
            connectionFields.profilePicture = user.profilePicture

            connectionFields.requestsSent = [{
                user: req.params.user_id,
                name: receiverUser.name,
                profilePicture: receiverUser.profilePicture
            }]

            connection = new Connection(connectionFields)
        }
        else {
            // Check if request is already sent or not
            if(connection.requestsSent.find(request => request.user.toString() === req.params.user_id)) {
                return res.status(400).json({ msg: 'You have already sent connection request to this user' })
            }

            // Check if user is already connected to receiver
            if(connection.connections.find(connc => connc.user.toString() === req.params.user_id)) {
                return res.status(400).json({ msg: 'You are already connected to this user' })
            }

            // Update request sent array if exists
            const request = {
                user: req.params.user_id,
                name: receiverUser.name,
                profilePicture: receiverUser.profilePicture
            }

            connection.requestsSent.unshift(request)
        }

        // Get receiver connection
        let receiverConnection = await Connection.findOne({ user: req.params.user_id })

        // Check if receiver connection exists and create a new if required
        if (!receiverConnection) {
            // Build an empty connection document
            const connectionFields = {}

            connectionFields.user = receiverUser.id
            connectionFields.name = receiverUser.name
            connectionFields.profilePicture = receiverUser.profilePicture

            connectionFields.requestsReceived = [{
                user: req.user.id,
                name: user.name,
                profilePicture: user.profilePicture
            }]

            receiverConnection = new Connection(connectionFields)
        }
        else {
            // Update request received array if exists
            const request = {
                user: req.user.id,
                name: user.name,
                profilePicture: user.profilePicture
            }

            receiverConnection.requestsReceived.unshift(request)
        }

        await connection.save()
        await receiverConnection.save()

        res.json(connection)

    } catch (err) {
        console.error(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'No user found' })
        }

        res.status(500).json({ msg: 'Server error' })
    }
})

// @route api/connections/acceptrequest/:user_id
// @desc Accept connection request by user id
// @access Private

router.put('/acceptrequest/:user_id', auth, async (req, res) => {
    try {
        // Get connection
        const connection = await Connection.findOne({ user: req.user.id })

        if (!connection) {
            return res.status(404).json({ msg: 'No connection request found' })
        }

        // Get sender connection
        const senderConnection = await Connection.findOne({ user: req.params.user_id })

        if(!senderConnection) {
            return res.status(404).json({ msg: 'No connection request found' })
        }

        // Get connection request received by user id
        const reqReceived = connection.requestsReceived.find(request => request.user.toString() === req.params.user_id)

        if(!reqReceived) {
            return res.status(404).json({ msg: 'No connection request found' })
        }

        const user = await User.findById(req.user.id)

        // Update connection

        // Build a new connection
        let newConnection = {}

        newConnection.user = reqReceived.user
        newConnection.name = reqReceived.name
        newConnection.profilePicture = reqReceived.profilePicture

        // Add new connection to connections
        connection.connections.unshift(newConnection)

        // Remove request from requests received
        
        // Get removing index
        let removingIndex = connection.requestsReceived.map(request => request.user.toString()).indexOf(req.params.user_id)

        // Remove request from requests received
        connection.requestsReceived.splice(removingIndex, 1)


        // Update conection of sender
        
        // Build a new connection of sender
        newConnection.user = req.user.id
        newConnection.name = user.name
        newConnection.profilePicture = user.profilePicture

        // Add new connection to sender connections
        senderConnection.connections.unshift(newConnection)

        // Remove request from requests sent of sender
        
        // Get removing index
        removingIndex = senderConnection.requestsSent.map(request => request.user.toString()).indexOf(req.user.id)

        // Remove request from requests sent of sender
        senderConnection.requestsSent.splice(removingIndex, 1)

        await connection.save()
        await senderConnection.save()

        res.json(connection)

    } catch (err) {
        console.error(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'This page does not exist, please check the url again' })
        }

        res.status(500).json({ msg: 'Server error' })
    }
})

// @route PUT api/connections/cancelrequest/:user_id
// @desc Remove a connection request (sender)
// @access Private

router.put('/cancelrequest/:user_id', auth, async (req, res) => {
    try {
        // Get connetion
        const connection = await Connection.findOne({ user: req.user.id })

        if (!connection) {
            return res.status(404).json({ msg: 'No connection request found' })
        }

        // Check if connection request exists
        const connectionRequest = connection.requestsSent.find(request => request.user.toString() === req.params.user_id)

        if (!connectionRequest) {
            return res.status(404).json({ msg: 'No connection request found' })
        }

        // Get removing index
        let removingIndex = connection.requestsSent.map(request => request.user.toString()).indexOf(req.params.user_id)

        connection.requestsSent.splice(removingIndex, 1)

        // Get receiver connection
        const receiverConnection = await Connection.findOne({ user: req.params.user_id })

        // Get removing index
        removingIndex = receiverConnection.requestsReceived.map(request => request.user.toString()).indexOf(req.user.id)

        receiverConnection.requestsReceived.splice(removingIndex, 1)

        await connection.save()
        await receiverConnection.save()

        res.json(connection)

    } catch (err) {
        console.error(err.message)
        res.status(500).json({ msg: 'Server error' })
    }
})

// @route PUT api/connections/declinerequest/:user_id
// @desc Remove a connection request (receiver)
// @access Private

router.put('/declinerequest/:user_id', auth, async (req, res) => {
    try {
        // Get connetion
        const connection = await Connection.findOne({ user: req.user.id })

        if (!connection) {
            return res.status(404).json({ msg: 'No connection request found' })
        }

        // Check if connection request from given user exists
        const connectionRequest = connection.requestsReceived.find(request => request.user.toString() === req.params.user_id)

        if (!connectionRequest) {
            return res.status(404).json({ msg: 'No connection request found' })
        }

        // Get removing index
        let removingIndex = connection.requestsReceived.map(request => request.user.toString()).indexOf(req.params.user_id)

        connection.requestsReceived.splice(removingIndex, 1)

        // Get sender connection
        const senderConnection = await Connection.findOne({ user: req.params.user_id })

        // Get removing index
        removingIndex = senderConnection.requestsSent.map(request => request.user.toString()).indexOf(req.user.id)

        senderConnection.requestsSent.splice(removingIndex, 1)

        await connection.save()
        await senderConnection.save()

        res.json(connection)

    } catch (err) {
        console.error(err.message)
        res.status(500).json({ msg: 'Server error' })
    }
})

// @route PUT api/connections/removeconnection/:user_id
// @desc Remove a connection by id
// @access Private

router.put('/removeconnection/:user_id', auth, async (req, res) => {
    try {
        // Get connection
        const connection = await Connection.findOne({ user: req.user.id })

        if (!connection) {
            return res.status(404).json({ msg: 'No connection found' })
        }

        // Get removing connection
        const removingConnc = connection.connections.find(connc => connc.user.toString() === req.params.user_id)

        if (!removingConnc) {
            return res.status(404).json({ msg: 'No connection found' })
        }

        // Get removing index
        let removingIndex = connection.connections.map(connc => connc.user.toString()).indexOf(req.params.user_id)

        // Remove connection
        connection.connections.splice(removingIndex, 1)

        // Get connection of other user
        const otherConnection = await Connection.findOne({ user: req.params.user_id })

        // Get removing index for other user
        removingIndex = otherConnection.connections.map(connc => connc.user.toString()).indexOf(req.user.id)

        // Remove connection from other user's connection model
        otherConnection.connections.splice(removingIndex, 1)

        await connection.save()
        await otherConnection.save()

        res.json(connection)

    } catch (err) {
        console.log(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'This page does not exist, please check the url again' })
        }

        res.status(500).json({ msg: 'Server error' })
    }
})

// @route GET api/connections
// @desc Get all connections
// @access Private

router.get('/', auth, async (req, res) => {
    try {
        const connections = await Connection.findOne({ user: req.user.id })

        res.json(connections)

    } catch (err) {
        console.error(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'This page does not exist, please check the url again' })
        }

        res.status(500).json({ msg: 'Server error' })
    }
})

// @route GET api/connections/:id
// @desc Get connections by profile
// @access Private

router.get('/:id', auth, async (req, res) => {
    try {
        const connections = await Connection.findOne({ user: req.params.id })

        res.json(connections)

    } catch (err) {
        console.error(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'This page does not exist, please check the url again' })
        }

        res.status(500).json({ msg: 'Server error' })
    }
})

module.exports = router