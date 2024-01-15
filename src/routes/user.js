const router = require("express").Router()
const usersController = require("../controllers/user")

// middleware to authenticate then getUser
router.get("/:id", usersController.getAllPostByUser)

module.exports = router