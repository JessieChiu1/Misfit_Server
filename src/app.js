const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const app = express()

const PORT = process.env.PORT || 3001

mongoose.set('strictQuery', false)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.TEST_DB_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next();
});

  

app.use(express.json());

app.use("/api/v1/auth", require("./routes/auth"))
app.use("/api/v1/user", require("./routes/user"))
app.use("/api/v1/post", require("./routes/post"))
app.use("/api/v1/photo", require("./routes/photo"))

module.exports = app

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests")
    })
})