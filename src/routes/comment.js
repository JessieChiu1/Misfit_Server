const router = require("express").Router()
const authMiddleware = require("../middleware/authenticate")
const commentController = require("../controllers/comment")

// authorization add middleware
router.post("/", authMiddleware.authenticate, commentController.createRootComment)

router.put("/:commentId/upvote", authMiddleware.authenticate, commentController.upvoteComment)

router.put("/:commentId/downvote", authMiddleware.authenticate, commentController.downvoteComment)

router.delete("/:commentId", authMiddleware.authenticate, commentController.deleteComment)

module.exports = router