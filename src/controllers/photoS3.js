const { S3, PutObjectCommand, DeleteObjectCommand } = require("aws-sdk");
require("dotenv").config()
const fs = require("fs")
const path = require("path")

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

const uploadImage = async (file) => {
    try {
        const fileStream = fs.createReadStream(file.path)
        const mainKey = path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname);
        console.log(mainKey)
    
        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: mainKey
        }
    
        const uploadResult = await s3.upload(uploadParams).promise()
        return uploadResult

    } catch (e) {
        console.log(e)
    }
}

const deleteImage = async (fileKey) => {
    try {
        const deleteParams = {
            Key: fileKey,
            Bucket: bucketName,
        }
    
        await s3.deleteObject(deleteParams).promise()
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    uploadImage,
    deleteImage
}