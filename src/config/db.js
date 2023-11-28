const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
// create the db
const db = mongoose.connection;

// connect the db
db.on("connected", () => {
    console.log("connected to MongoDB @" + db.host);
});

module.exports = mongoose.connect(process.env.TEST_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});