const User = require("../models/user");

const getUser = async (req, res) => {
    id = req.params.id
    const foundUser = await User.findById(id)

    // look up projection
    if (!foundUser) {
        return res.status(404).json({
            "message": "No such user found"
        })
    }

    return res.status(200).json({
        username: foundUser.username
    })
}

module.exports = {
    getUser,
}