const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authController = require('./controllers/authController')
const conversationControler = require('./controllers/conversationController')
const messageController = require('./controllers/messageController')
const userController = require('./controllers/userController')
const app = express()
require('dotenv').config()

// db connect
mongoose.connect(process.env.MONGO_URL, () => console.log('DB is connected successfully'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/auth', authController)
app.use('/conversation', conversationControler)
app.use('/message', messageController)
app.use('/user', userController)


app.listen(process.env.PORT, () => console.log('Server has been started successfully'))