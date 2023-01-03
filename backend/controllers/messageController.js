const verifyToken = require('../middleware/verifyToken')
const MessageSchema = require('../models/Message')
const messageController = require('express').Router()


// create(send) message
messageController.post('/', verifyToken, async(req, res) => {
    try {
       const {messageText, conversationId} = req.body
       const newMessage = await MessageSchema.create({messageText, senderId: req.user.id, conversationId})
       return res.status(201).json(newMessage)
    } catch (error) {
        console.error(error)
    }
})

// get all messages from conversation
messageController.get('/:convoId', verifyToken, async(req, res) => {
    try {
        const messages = await MessageSchema.find({conversationId: req.params.convoId})
        console.log(messages)
        return res.status(200).json(messages)
    } catch (error) {
        console.error(error)
    }
})

module.exports = messageController
