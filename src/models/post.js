const mongoose = require("mongoose")

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
        enum: ["Outerwear", "Top", "Pant", "Skirt", "Accessory"],
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
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
    },
    photo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Photo"
    }]
})

// export the schema
module.exports = mongoose.model("Post", postSchema);