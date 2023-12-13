const Post = require("../models/post")
const User = require("../models/user")
const s3Controller = require("./photoS3")

const findPost = async(req, res) => {
    try {
        id = req.params.id
        const foundPost = await Post.findById(id)
    
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
        const newPost = await Post.create({
            user: req.user.id,
            title: req.body.title,
            type: req.body.type,
            review: req.body.review,
            style: req.body.style,
            like: 0,
            price: req.body.price
        })
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
        // delete post
        const deletedPost = await Post.findByIdAndDelete(req.params.id);

        if (!deletedPost) {
            return res.status(404).send("Post not found")
        }

        const photoIds = deletedPost.photo.map(photo => photo.id)

        for (const photoId of photoIds) {
            const photo = await Photo.findByIdAndDelete(photoId).lean()
            if (photo) {
                await s3.Controller.deleteImage(photo.mainKey)
            }
        }

        // remove the deleted post from User's post array
        await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { post: req.params.id } },
        );

        return res.status(200).json({ message: 'Deleted Post' });
    } catch(e) {
        console.log(e)
        return res.status(500).json({
            message: `Internal Service Error. Please try again. ${e}`
        })
    }
}

const updatePost = async(req, res) => {
    try {
        const updateFields = {};
        const { title, type, review, style, price } = req.body;

        if (title) updateFields.title = title;
        if (type) updateFields.type = type;
        if (review) updateFields.review = review;
        if (style) updateFields.style = style;
        if (price) updateFields.price = price;

        const updatedPost = await Post.findOneAndUpdate(
            {_id: req.params.id},
            { $set: updateFields },
            { new: true },
        )
        
        return res.status(200).json(updatedPost)

    } catch(e) {
        console.log(e)
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
    deletePost,
}