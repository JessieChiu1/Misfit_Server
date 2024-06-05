const router = require("express").Router()
const usersController = require("../controllers/auth")

router.post("/signup", usersController.signUp);

router.post("/login", usersController.login);

module.exports = router