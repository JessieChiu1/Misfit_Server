const mongoose = require("mongoose")
const Article = require('./article');

// create schema
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["Coat/Jack", "Top", "Pant", "Skirt", "Accessory"],
        required: true
    },
    review: {
        type: String,
        required: true,
    },
    style: {
        type: String,
        enum: ["Masculine", "Feminine", "Androgynous"],
        required: true
    },
    like: {
        type: Integer,
        default: 0,
    },
    price: {
        type: Integer,
    }
    // image
})

// export the schema
module.exports = mongoose.model("Post", postSchema);