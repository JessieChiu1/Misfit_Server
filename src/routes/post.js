const router = require("express").Router()
const authController = require("../controllers/auth")
const postController = require("../controllers/post")

router.get("/:id", authController.authenticate, postController.findPost);

router.post("/post", authController.authenticate, postController.newPost);

router.delete("/:id", authController.authenticate, postController.deletePost);

router.put("/:id", authController.authenticate, postController.updatePost);

module.exports = router