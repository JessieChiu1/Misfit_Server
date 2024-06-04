const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const app = express()

const PORT = process.env.PORT || 3001

// connect to MongoDB function
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.DB_URI)
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
}

app.use((req, res, next) => {
    const allowedOrigin = process.env.API_URL || 'http://localhost:3000'
    res.header('Access-Control-Allow-Origin', allowedOrigin)
    res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

  
app.use(express.json());

app.use("/api/v1/auth", require("./routes/auth"))
app.use("/api/v1/user", require("./routes/user"))
app.use("/api/v1/post", require("./routes/post"))
app.use("/api/v1/photo", require("./routes/photo"))
app.use("/api/v1/comment", require("./routes/comment"))

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!"})
})

//Connect to the database before listening to avoid cyclic error
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})

module.exports = app