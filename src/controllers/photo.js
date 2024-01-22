const s3Controller = require("./photoS3")
const Photo = require("../models/photo")
const Post = require("../models/post")
const fs = require("fs")

const getAllImage = async(req, res) => {
    try {
        const photos = await Photo.find().lean()
        res.send({ photos })
    } catch(e) {
        next(e)
    }
}

const getOne = async(req, res) => {
    try {
        const photo = await Photo.findById(req.params.id).lean()
        if (!photo) {
            return res.status(401).send("photo id not found")
        }
        res.send({ photo })
    } catch (e) {
        next(e)
    }
}

const uploadOne = async(req, res) => {
    try {
        // upload to AWS s3
        const photo_info = await s3Controller.uploadImageToS3(req.file)

        const photoObject = {
            mainUrl: photo_info.Location,
            mainKey: photo_info.Key
        }

        const newPhoto = await Photo.create(photoObject)
        
        await fs.unlinkSync(req.file.path)

        res.status(200).send({
            id: newPhoto._id
        })
        
    } catch (e) {
        console.log(e)
    }
}

const deleteOne = async(req, res) => {
    try {
        // find photo in DB
        const photo = await Photo.findByIdAndDelete(req.params.id).lean()

        if (!photo) {
            return res.status(404).send("photo id not found")
        }

        // if the photo is deleted, remove that photo from post
        if (photo) {
            await Post.findOneAndUpdate(
                { users: req.user.id },
                { $pull: { post: req.params.id } },
            )
        }

        //delete from S3
        await s3Controller.deleteImageFromS3(photo.mainKey)
        res.status(204).send("deleted image")
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getAllImage,
    getOne,
    uploadOne,
    deleteOne
}