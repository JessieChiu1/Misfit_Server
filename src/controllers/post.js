const Post = require("../models/post")

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
            user: req.params.id,
            title: req.body.title,
            type: req.body.type,
            review: req.body.review,
            style: req.body.style,
            like: 0,
            price: req.body.price
        })
        // need to add where we update the user schema
        
        if (newPost) {
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
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        // need to delete the post from user's schema

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