const router = require("express").Router()
const authMiddleware = require("../middleware/authenticate")
const postController = require("../controllers/post")

// authorization add middleware
router.post("/", authMiddleware.authenticate, postController.newPost);

router.get("/:id", postController.findPost);

router.delete("/:id", authMiddleware.authenticate, postController.deletePost);

router.put("/:id", authMiddleware.authenticate, postController.updatePost);

router.get("/", postController.allPosts)

router.get("/masculine", postController.findAllMasculine)

router.get("/feminine", postController.findAllFeminine)

router.get("/androgynous", postController.findAllAndrogynous)

module.exports = router