const router = require("express").Router()
const multer = require("multer")
const photoController = require("../controllers/photo")
const authMiddleware = require("../middleware/authenticate")

// Configure multer to use multer-memory-storage for in-memory file storage to fix cyclic deployment issue
const upload = multer({
  storage: multer.memoryStorage(),
})

// For photo upload, multer will take this photo's binary code and store it in memory
const parseImage = upload.single('file')

router.get("/", photoController.getAllImage)
router.get("/:id", photoController.getOne)
router.post("/", authMiddleware.authenticate, parseImage, photoController.uploadOne)
router.delete("/:id", authMiddleware.authenticate, photoController.deleteOne)

module.exports = router
