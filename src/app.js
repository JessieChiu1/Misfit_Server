const express = require("express")

const app = express();

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