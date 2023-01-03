const verifyToken = require("../middleware/verifyToken")
const Conversation = require("../models/Conversation")
const ConversationRouter = require('express').Router()

// create a conversation
ConversationRouter.post('/', verifyToken, async(req, res) => {
    try {
        const { receiverId } = req.body
        const currentUserId = req.user.id
        const isConvoAlreadyCreated = await Conversation.find({members: {$all: [receiverId, currentUserId]}})
        if(isConvoAlreadyCreated){
            return res.status(500).json({msg: 'There is already such a conversation'})
        }
        await Conversation.create({members: [currentUserId, receiverId]})
        return res.status(201).json({msg: 'Conversation successfully created'})
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// get user conversations
ConversationRouter.get('/find/:userId', verifyToken, async(req, res) => {
    if(req.user.id  === req.params.userId){
        try {
            const userId = req.user.id
            const conversations = await Conversation.find({members: {$in: [userId]}})
            return res.status(200).json(conversations)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(403).json({msg: 'You can get only your own conversations'})
    }
})

// get a conversation
ConversationRouter.get('/:convoId', async(req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.convoId)
        if(conversation.members.includes(req.user.id)){
            return res.status(200).json(conversation)
        } else {
            return res.status(403).json({msg: 'This conversation does not include you'})
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

module.exports = ConversationRouter