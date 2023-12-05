const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signUp = async (req, res) => {
	try {
		const username = req.body.username;
		const password = req.body.password;
		// check if username/password exist from the request
		if (!username || !password) {
			return res.status(400).json({
				message: "missing username/password",
			});
		}
		// check DB if the user already exist with the username
		const foundUser = await User.findOne({
			username,
		});
		if (foundUser) {
			return res.status(400).json({
				message: "username already exist!",
			});
		}
		// if user doesn't already exist, encrypt password
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);
		// then create a user document in our DB
		const newUser = await User.create({
			username,
			password: hashedPassword,
		});
		// then we will generate the token, and include a user id in the token
		// the payload is the information stored in the JWT token
		const payload = { 
			username: newUser.username, 
			id: newUser._id.toString(),
		};
	
		// create token, and sign the token
		const authToken = jwt.sign(payload, process.env.JWT_SECRET, {
			algorithm: "HS256",
			expiresIn: "6h",
		});

		// Decode the token to retrieve iat and update the newUser's iat
		// have to do this after the token is generate not before
		const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
		const iatFromToken = decodedToken.iat;
		await User.findOneAndUpdate(
			{ username },
			{ $set: { iat: iatFromToken } },
		);
		// then respond with the token
		return res.status(200).json({
			token: authToken,
		});
	} catch(e) {
        console.log(e)
		return res.status(500).json({
			message: `Internal Service Error. Please try again. ${e}`
		})
	}
}

const login = async (req, res) => {
	try {
		const username = req.body.username;
		const password = req.body.password;
		// check if username or password is missing from the request
		if (!username || !password) {
			return res.status(400).json({
				message: "Missing Username or Password",
			})
		}
		// Find user
		const foundUser = await User.findOne({
			username,
		})
		// if user doesn't exist
		if (!foundUser) {
			return res.status(400).json({
				message: "Incorrect Username or Password"
			})
		}

        // compare the DB password and the req password
		const correctPassword = bcrypt.compareSync(password, foundUser.password)
		if (!correctPassword) {
			return res.status(400).json({
				message: "Incorrect Username or Password"
			})
		}
        
		// Everything is good so return the JWT token
		const payload = {
			username: foundUser.username,
			id: foundUser._id.toString()
		}
	
		const authToken = jwt.sign(payload, process.env.JWT_SECRET, {
			algorithm: "HS256",
			expiresIn: "6h",
		})
		// Decode the new token to retrieve iat
		const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
		const iatFromToken = decodedToken.iat;
		// update the User's iat
		await User.findOneAndUpdate(
			{ username },
			{ $set: { iat: iatFromToken } },
		);

		return res.status(200).json({
			token: authToken
		})
	} catch(e) {
		return res.status(500).json({
			message: `Internal Service Error. Please try again. ${e}`
		})
	}

}

module.exports = {
    signUp,
    login,
}