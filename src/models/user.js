const mongoose = require("mongoose")

// create schema
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
})

// export the schema
module.exports = mongoose.model("User", userSchema);