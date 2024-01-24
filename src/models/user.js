const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],
    iat: {
        type: Number,
        default: 0
    },
})

module.exports = mongoose.model("User", userSchema);