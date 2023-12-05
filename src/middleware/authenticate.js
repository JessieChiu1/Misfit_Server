const User = require("../models/user");
const jwt = require("jsonwebtoken");
// authenticate
// still need to add a check where the we compare if the token belongs to the user?

const authenticate = async (req, res, next) => {
	try {
	  // check if auth exists in the header
	  const auth = req.headers.authorization;
	  if (!auth) {
		return res.status(400).json({
		  message: "missing token",
		});
	  }
  
	  // find token and verify token for identity
	  const token = auth.split(" ")[1];
	  const tokenInfo = jwt.verify(token, process.env.JWT_SECRET);
	  const user = await User.findById(tokenInfo.id);
  
	  // add a check to see if the token matches with the user in DB
	  if (user && user.iat === tokenInfo.iat) {
		req.user = tokenInfo;
		// next() -> tell express to trigger the next middleware
		next();
	  }
	} catch (e) {
	  console.log(e);
	  return res.status(401).json({
		message: "unauthorized",
	  });
	}
};

module.exports = {
	authenticate
}