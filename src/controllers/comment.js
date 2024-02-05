const Comment = require("../models/comment")
const Post = require("../models/post")
const User = require("../models/user")

const createRootComment = async(req, res) => {
    try {
        const payload = req.body
        const newComment = await Comment.create(payload)

        //update the Post's comment array
        const postId = payload.parent
        await Post.findByIdAndUpdate(
            postId,
            { $push: { comment: newComment._id } },
            { new: true }
        )

        //update the User's comment array
        const userId = payload.user;
        await User.findByIdAndUpdate(
            userId,
            { $push: { comment: newComment._id } },
            { new: true }
        )

        res.status(200).json(newComment)
    } catch(e) {
        console.log(`Internal Service Error: Please try again: ${e}`)
    }
}

module.exports = {
    createRootComment
}