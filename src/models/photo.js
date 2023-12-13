const mongoose = require("mongoose")

const photoSchema = mongoose.Schema({
    mainUrl: {
        type: String,
        required: true,
    },
    mainKey: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Photo", photoSchema)
