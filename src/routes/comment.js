const router = require("express").Router()
const authMiddleware = require("../middleware/authenticate")
const commentController = require("../controllers/comment")

// authorization add middleware
router.post("/", authMiddleware.authenticate, commentController.createRootComment)

router.put("/:commentId/:userId/upvote", authMiddleware.authenticate, commentController.upvoteComment)

router.put("/:commentId/:userId/downvote", authMiddleware.authenticate, commentController.downvoteComment)

module.exports = router