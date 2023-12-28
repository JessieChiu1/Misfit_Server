const router = require("express").Router()
const authMiddleware = require("../middleware/authenticate")
const postController = require("../controllers/post")

// authorization add middleware
router.post("/", authMiddleware.authenticate, postController.newPost);

router.get("/:id", postController.findPost);

router.delete("/:id", authMiddleware.authenticate, authMiddleware.sameUser, postController.deletePost);

router.put("/:id", authMiddleware.authenticate, authMiddleware.sameUser, postController.updatePost);

router.get("/", postController.findLatestPost)

router.get("/:style", postController.findPostByStyle)

module.exports = router