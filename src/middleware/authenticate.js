const User = require("../models/user")
const jwt = require("jsonwebtoken")
const Post = require("../models/post")
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
		req.user = tokenInfo
		next()
	  }
	} catch (e) {
	  console.log("authenticate", e);
	  return res.status(401).json({
		message: "unauthorized",
	  })
	}
}

const sameUser = async(req, res, next) => {
	const siginUser = req.user.id
	const postId = req.params.postId

	try {
		const postOwner = await Post.findById(postId).populate('user')

		if (postOwner.user._id.toString() !== siginUser) {
			return res.status(403).json({
				message: "You are not the owner of this post"
			})
		}
		next()
	} catch (e) {
		console.log("sameUser", e)
	}
}

module.exports = {
	authenticate,
	sameUser
}