const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const db = mongoose.connection

db.on("connected", () => {
    console.log("Connected to MongoDB @" + db.host);
})

// Export a function that returns the promise of the database connection
module.exports = () => {
    return mongoose.connect(process.env.TEST_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}
