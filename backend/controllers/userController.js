const User = require("../models/User");

const userController = require("express").Router();

userController.get('/find/:id', async(req, res) => {
    try {
       const user = await User.findById(req.params.id)
       const {password, ...others} = user._doc
       return res.status(200).json(others) 
    } catch (error) {
        console.error(error)
    }
})

module.exports = userController