const mongoose = require("mongoose")

// create schema
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
        enum: ["Activewear", "Coats", "Jackets & Blazers", "Suits & Separates", "Dresses", "Jeans & Denim", "Loungewear", "Pants & Leggings", "Skirts", "Sleepwear", "Sweaters", "Sweatshirts & Hoodies", "T-Shirt", "Shoes", "Accessory", "Outfit Showcase", "Underwear", "Bra", "Shorts", "Swimwear", "Dress Shirt", "Blouses", "Dress Pants"],
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