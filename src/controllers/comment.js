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

const upvoteComment = async(req, res) => {
    try {
        const commentId = req.params.commentId
        const foundUser = await User.findById(req.user.id)

        await Comment.findByIdAndUpdate(
            commentId,
            {
                $addToSet: { upvote: foundUser._id },
                $pull: { downvote: foundUser._id }
            }
        );

        res.status(200).json({
            message: "Comment upvoted successfully",
        })

    } catch(e) {
        console.log(`Internal Service Error: Please try again: ${e}`)
    }
}

const downvoteComment = async(req, res) => {
    try {
        const commentId = req.params.commentId
        const foundUser = await User.findById(req.user.id)

        await Comment.findByIdAndUpdate(
            commentId,
            {
                $pull: { upvote: foundUser._id },
                $addToSet: { downvote: foundUser._id }
            }
        );

        res.status(200).json({
            message: "Comment downvoted successfully",
        })

    } catch(e) {
        console.log(`Internal Service Error: Please try again: ${e}`)
    }
}

const deleteComment = async (req, res) => {
    try {
        const userId = req.user.id

        const foundComment = await Comment.findById(req.params.commentId)

        if (foundComment.rightToDelete.map(id => id.toString()).includes(userId)) {
            await Comment.findByIdAndDelete(req.params.commentId)
            return res.status(200).json({
                message: "Comment deleted successfully"
            })
        } else {
            return res.status(403).json({
                message: "User is not authorized to delete this comment"
            })
        }
    } catch (e) {
        console.log(`Internal Service Error: Please try again: ${e}`)
    }
}



module.exports = {
    createRootComment,
    upvoteComment,
    downvoteComment,
    deleteComment
}