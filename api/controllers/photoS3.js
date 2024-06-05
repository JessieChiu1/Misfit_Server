const { S3 } = require("aws-sdk");
require("dotenv").config()
const path = require("path")

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_MY_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_MY_SECRET_ACCESS_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

const uploadImageToS3 = async (file) => {
    try {
        const mainKey = `${file.originalname}-${Date.now()}`
    
        const uploadParams = {
            Bucket: bucketName,
            Body: file.buffer,
            Key: mainKey
        }
    
        const uploadResult = await s3.upload(uploadParams).promise()
        return uploadResult

    } catch (e) {
        console.log(e)
    }
}

const deleteImageFromS3 = async (fileKey) => {
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
    uploadImageToS3,
    deleteImageFromS3
}