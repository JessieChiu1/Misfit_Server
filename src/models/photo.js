const mongoose = require("mongoose")

const photoSchema = mongoose.Schema({
    image: {
        type: Buffer
    }
});

module.exports = mongoose.model("Photo", photoSchema)
