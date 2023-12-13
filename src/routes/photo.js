const router = require("express").Router()
const multer = require("multer")
const photoController = require("../controllers/photo")
const authMiddleware = require("../middleware/authenticate")

const parseImage = multer({ dest: 'temp/' }).single('file');

// For photo upload, multer will take this photo's binary code and store it in the "temp" folder

router.get("/", photoController.getAllImage)
router.get("/:id", photoController.getOne)
router.post("/", authMiddleware.authenticate, parseImage, photoController.uploadOne)
router.delete("/:id", authMiddleware.authenticate, photoController.deleteOne)

module.exports = router