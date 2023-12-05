const router = require("express").Router()
const authController = require("../controllers/auth")
const usersController = require("../controllers/user")

// middleware to authenticate then getUser
router.get('/:id', usersController.getUser)

module.exports = router