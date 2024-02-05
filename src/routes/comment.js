const router = require("express").Router()
const authMiddleware = require("../middleware/authenticate")
const commentController = require("../controllers/comment")

// authorization add middleware
router.post("/", authMiddleware.authenticate, commentController.createRootComment)

module.exports = router