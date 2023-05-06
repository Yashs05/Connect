const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')

const connectToDb = require('./db')

const { Server } = require('socket.io')
const Connection = require('./models/Connection')

const app = express()

// Connect to database
connectToDb()

// Initialize middleware
app.use(express.json({ extended: false, limit: '50mb' }))

app.use(fileUpload({
    useTempFiles: true,
}))

app.use(cors())

// Define routes
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/connections', require('./routes/api/connections'))

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})

const io = new Server(server, {
    cors: true,
    origins: ['https://connect-f57e.onrender.com']
})

io.on('connection', socket => {

    socket.on('join', userId => {
        socket.join(userId)
        console.log(`${userId} joined`)
    })

    socket.on('connectionEmit', async userId => {
        const connection = await Connection.findOne({ user: userId })
        io.in(userId).emit('connectionEmit', connection)
    })

    socket.on('profileEmit', profile => {
        socket.broadcast.emit('profileEmitted', profile)
    })

    socket.on('profileDelete', id => {
        socket.broadcast.emit('profileDeleted', id)
    })

    socket.on('addPost', post => {
        socket.broadcast.emit('postAdded', post)
    })

    socket.on('deletePost', id => {
        socket.broadcast.emit('postDeleted', id)
    })

    socket.on('likePost', data => {
        socket.broadcast.emit('postLiked', data)
    })

    socket.on('unlikePost', data => {
        socket.broadcast.emit('postUnliked', data)
    })

    socket.on('addComment', data => {
        socket.broadcast.emit('commentAdded', data)
    })

    socket.on('deleteComment', data => {
        socket.broadcast.emit('commentDeleted', data)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
});

// ----------------------------Deployment----------------------------
const rootDirectory = path.resolve('../')

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(rootDirectory, '/client/build')));

    app.get('*', (req,res) => res.sendFile(path.resolve(rootDirectory, 'client', 'build', 'index.html')));
  }
  else{
    app.get('/', (req, res) => {
        res.send('Api running')
    })
  }

