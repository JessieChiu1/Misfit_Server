const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:  true,
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["Accessory", "Activewear", "Blouses", "Bra", "Coats", "Dress Pants", "Dress Shirt", "Dresses", "Jackets & Blazers", "Jeans & Denim", "Loungewear", "Outfit Showcase", "Pants & Leggings", "Shoes", "Shorts", "Skirts", "Sleepwear", "Suits & Separates", "Sweaters", "Sweatshirts & Hoodies", "Swimwear", "T-Shirt", "Underwear"],
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
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    price: {
        type: Number,
    },
    photo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Photo"
    }],
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: []
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model("Post", postSchema)