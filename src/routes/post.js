const router = require("express").Router()
const authMiddleware = require("../middleware/authenticate")
const postController = require("../controllers/post")

// authorization add middleware
router.post("/", authMiddleware.authenticate, postController.newPost)

// find by photoId
router.get("/:id", postController.findPost)

router.delete("/:postId", authMiddleware.authenticate, authMiddleware.sameUser, postController.deletePost)

router.put("/:postId", authMiddleware.authenticate, authMiddleware.sameUser, postController.updatePost)

router.get("/", postController.findLatestPost)

router.get("/style/:style", postController.findLatestPostByStyleAndFilter)

router.put("/:postId/like", authMiddleware.authenticate, postController.updateLikedPost)

router.put("/:postId/unlike", authMiddleware.authenticate, postController.updateUnlikedPost)

router.get("/comment/:postId", postController.findRootCommentByPostId)

module.exports = router