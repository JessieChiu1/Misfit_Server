const app = require("./app");
const dbConnectionPromise = require("./config/db");

dbConnectionPromise.then(() => {
	app.listen((PORT = 3001), () => {
		console.log(`listing to PORT ${PORT}`);
	});
})