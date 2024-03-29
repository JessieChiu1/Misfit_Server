const Post = require("../models/post")
const User = require("../models/user")
const Photo = require("../models/photo")
const Comment = require("../models/comment")
const s3Controller = require("./photoS3")

const findPost = async(req, res) => {
    try {
        id = req.params.id
        const foundPost = await Post.findById(id).populate("user", "username").populate("photo")
    
        if (!foundPost) {
            return res.status(404).json({
                "message": "No such post found"
            })
        }
        
        return res.status(200).json(foundPost)
    } catch(e) {
        console.log(e)
        return res.status(500).json({
            message: `Internal Service Error. Please try again ${e}`
        })
    }
}

const newPost = async(req, res) => {
    try{
        const payload = req.body
        const newPost = await Post.create(payload)
        
        // need to add where we update the user schema
        if (newPost) {
            // also update the User's post array with new post ID
            await User.findByIdAndUpdate(
                req.user.id,
                { $push: { post: newPost._id } },
            )
            return res.status(200).json(newPost)
        } else {
            return res.status(500).json({
                message: "Error creating post."
            })
        }
    } catch(e) {
        console.log(e)
        return res.status(500).json({
            message: `Internal Service Error. Please try again ${e}`
        })
    }
}

const deletePost = async(req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.postId);

        if (!deletedPost) {
            return res.status(404).send("Post not found")
        }

        for (const photoId of deletedPost.photo) {
            const photo = await Photo.findByIdAndDelete(photoId)
            if (photo) {
                await s3Controller.deleteImageFromS3(photo.mainKey)
            }
        }

        for (const commentId of deletedPost.comment) {
            await Comment.findByIdAndDelete(commentId)
        }

        // remove the deleted post from User's post array
        await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { post: req.params.postId } },
        )


        return res.status(200).json({ message: 'Deleted Post' });
    } catch(e) {
        return res.status(500).json({
            message: `Internal Service Error. Please try again. ${e}`
        })
    }
}

const updatePost = async (req, res) => {
    try {
        const foundPost = await Post.findById(req.params.postId);
        const foundPostPhoto = await Photo.findById(foundPost.photo[0]._id)

        const updateFields = {}
        const { title, type, review, style, price, photo } = req.body

        if (title) updateFields.title = title
        if (type) updateFields.type = type
        if (review) updateFields.review = review
        if (style) updateFields.style = style
        if (price) updateFields.price = price

        if (photo) {
            await s3Controller.deleteImageFromS3(foundPostPhoto.mainKey)
            updateFields.photo = photo
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            { $set: updateFields },

        )

        return res.status(200).json({ message: "Post Updated successfully"})
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: `Internal Service Error. Please try again ${e}`,
        });
    }
};


const findLatestPost = async(req, res) => {
    try {
        let allPosts
        if (req.query.style) {
            allPosts = await Post.find().sort({ createdAt: -1 }).limit(500).populate("photo").populate("user", "username")

        } else {
            allPosts = await Post.find().sort({ createdAt: -1 }).limit(500).populate('photo').populate("user", "username")
        }
        return res.status(200).json(allPosts)
    } catch (e) {
        return res.status(500).json({
            message: `Internal Service Error. Please try again ${e}`
        })
    }
}

const findLatestPostByStyleAndFilter = async(req, res) => {
    try {
        let query = {}

        query.style = req.params.style.charAt(0).toUpperCase() + req.params.style.slice(1)

        if (req.query.type) {
            query.type = req.query.type
        }

        const allPosts = await Post.find(query).sort({ createdAt: -1 }).limit(500).populate("photo").populate("user", "username")

        return res.status(200).json(allPosts)
    } catch (e) {
        return res.status(500).json({
            message: `Internal Service Error. Please try again ${e}`
        })
    }
}

const updateLikedPost = async (req, res) => {
    try {
        const foundUser = await User.findById(req.user.id)
        const postId = req.params.postId

        const post = await Post.findById(postId)
        if (post.like.includes(foundUser._id)) {
            return res.status(200).json({
                message: "Post already liked by the user",
            })
        }

        await Post.findByIdAndUpdate(
            postId,
            { $push: { like: foundUser._id } },
        )

        return res.status(200).json({
            message: "Post liked successfully",
        })

    } catch (e) {
        return res.status(500).json({
            message: `Internal Service Error. Please try again ${e}`,
        })
    }
}


const updateUnlikedPost = async(req, res) => {
    try {
        const foundUser = await User.findById(req.user.id)

        await Post.findByIdAndUpdate(
            req.params.postId,
            { $pull: { like: foundUser._id } },
        )

        return res.status(200).json({
            message: "Post unliked successfully"
        })

    } catch (e) {
        return res.status(500).json({
            message: `Internal Service Error. Please try again ${e}`
        })
    }
}

const findRootCommentByPostId = async(req, res) => {
    try{
        const postId = req.params.postId
        const foundPost = await Post.findById(postId).populate('comment')

        const populatedComment = await Comment.populate(foundPost.comment, {
            path: 'user',
            select: 'username',
        })
    
        return res.status(200).json(populatedComment)
    } catch (e) {
        return res.status(500).json({
            message: `Internal Service Error. Please try again ${e}`
        })
    }
}


module.exports = {
    findPost,
    newPost,
    deletePost,
    updatePost,
    findLatestPost,
    findLatestPostByStyleAndFilter,
    updateLikedPost,
    updateUnlikedPost,
    findRootCommentByPostId
}