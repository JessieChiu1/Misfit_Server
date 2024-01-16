const User = require("../models/user")
const Post = require("../models/post")

const getAllPostByUser = async(req, res) => {
    const id = req.params.id;

    try {
      const foundUser = await User.findById(id).populate("post")
  
      if (!foundUser) {
        return res.status(404).json({
          message: "No such user found",
        })
      }
  
      const populatedPosts = await Post.populate(foundUser.post, { path: "photo" })
  
      return res.status(200).json(populatedPosts)
    } catch (error) {
      console.error("Error fetching posts:", error)
      return res.status(500).json({
        message: "Internal Server Error",
      })
    }
}

module.exports = {
    getAllPostByUser,

}