const router = require("express").Router()
const authController = require("../controllers/auth")
const postController = require("../controllers/post")

router.post("/", authController.authenticate, postController.newPost);

router.get("/:id", postController.findPost);

router.delete("/:id", authController.authenticate, postController.deletePost);

router.put("/:id", authController.authenticate, postController.updatePost);

module.exports = router