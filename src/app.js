const express = require("express");

const app = express();

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header("Access-Control-Allow-Methods", "POST,GET");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	next();
});

app.use(express.json());

app.use("/api/v1/auth", require("./routes/auth"))
app.use("/api/v1/user", require("./routes/user"))

// home page route
app.get("/", (req, res) => res.send("okay"));

module.exports = app