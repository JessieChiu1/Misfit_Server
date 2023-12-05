const app = require("../../src/app")
const { MongoMemoryServer } = require("mongodb-memory-server");
const supertest = require("supertest");
const mongoose = require("mongoose")
const dotenv = require("dotenv/config");
const User = require("../../src/models/user")

let token

const userPayload = {
    username: "jessie",
    password: "password",
}

let postId

const postPayload = {
    "title": "blue hat",
    "type": "Accessory",
    "review": "awesome",
    "style": "Androgynous",
    "price": 25
}

const updatedPostPayload = {
    "title": "test hat",
    "type": "Accessory",
    "review": "testing testing",
    "style": "Androgynous",
    "price": 10
}

describe("post.js", () => {

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        await mongoose.connect(mongoServer.getUri())

        // create User
        const response = await supertest(app)
            .post("/api/v1/auth/signup")
            .send(userPayload)
        token = response.body.token
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })

    describe("creating a new post", () => {
        describe("given User is not sign in", () => {
            it("should return 400 when creating a new post", async () => {
                const response = await supertest(app).post(`/api/v1/post`)
                    .send(postPayload)
    
                expect(response.status).toBe(400)
                expect(response.body).toMatchSnapshot()
            })
        })
        describe("given User is signed in", () => {
            it("should return 200, product and update User's post array", async () => {
                // act
                const response = await supertest(app).post(`/api/v1/post`)
                    .send(postPayload)
                    .set({ "Authorization": `Bearer ${token}` })
                
                postId = response.body._id.toString()

                const foundUser = await User.findOne({
                    username: "jessie"
                })
    
                // expectation
                expect(response.status).toBe(200)
                expect(response.body.title).toBe("blue hat")
                expect(response.body.type).toBe("Accessory")
                expect(response.body.review).toBe("awesome")
                expect(response.body.style).toBe("Androgynous")
                expect(response.body.price).toBe(25)
                expect(response.body).toHaveProperty("_id")
                expect(foundUser.post).toHaveLength(1)

                expect(response.body).toMatchSnapshot({
                    "__v": 0,
                    "_id": expect.any(String),
                    "like": 0,
                    "price": 25,
                    "review": "awesome",
                    "style": "Androgynous",
                    "title": "blue hat",
                    "type": "Accessory",
                    "user": expect.any(String),
                  })
            })
    
        })
    })

    describe("finding a post", () => {
        describe("given the postId", () => {
            it("should return 200 and post", async () => {
                // act
                const response = await supertest(app).get(`/api/v1/post/${postId}`)
                // expectation
                expect(response.status).toBe(200)
                expect(response.body.title).toBe("blue hat")
                expect(response.body.type).toBe("Accessory")
                expect(response.body.review).toBe("awesome")
                expect(response.body.style).toBe("Androgynous")
                expect(response.body.price).toBe(25)
                expect(response.body).toHaveProperty("_id")
    
                expect(response.body).toMatchSnapshot({
                    "__v": 0,
                    "_id": expect.any(String),
                    "like": 0,
                    "price": 25,
                    "review": "awesome",
                    "style": "Androgynous",
                    "title": "blue hat",
                    "type": "Accessory",
                    "user": expect.any(String),
                  })
            })
        })
    })

    describe("updating a post", () => {     
        describe("given the postId and the updated post information", () => {
            it("should return 200 and the update post", async () => {
                // act
                const response = await supertest(app).put(`/api/v1/post/${postId}`)
                    .send(updatedPostPayload)
                    .set({ "Authorization": `Bearer ${token}` })
                // expectation
                expect(response.status).toBe(200)
                expect(response.body.title).toBe("test hat")
                expect(response.body.type).toBe("Accessory")
                expect(response.body.review).toBe("testing testing")
                expect(response.body.style).toBe("Androgynous")
                expect(response.body.price).toBe(10)
    
                expect(response.body).toMatchSnapshot({
                    "__v": 0,
                    "_id": expect.any(String),
                    "like": 0,
                    "price": 10,
                    "review": "testing testing",
                    "style": "Androgynous",
                    "title": "test hat",
                    "type": "Accessory",
                    "user": expect.any(String),
                  })
            })
        })
    })

    describe("deleting a post", () => {
        describe("given only the postId", () => {
            it("should return 400", async () => {
                const response = await supertest(app)
                .delete(`/api/v1/post/${postId}`)

                expect(response.status).toBe(400)
            })
        })
        describe("given the author of the post and postId", () => {
            it("should return 200, the message 'Deleted Post' and remove Post from User's post array", async () => {
                // act
                // need to compare the User's post array before and after post deletion
                const foundUserBeforeDeletion  = await User.findOne({
                    username: "jessie"
                })
                const expectedLen = foundUserBeforeDeletion .post.length - 1
                
                const response = await supertest(app)
                    .delete(`/api/v1/post/${postId}`)
                    .set("Authorization", `Bearer ${token}`)
    
                const foundUserAfterDeletion  = await User.findOne({
                    username: "jessie"
                })
    
                // expectation
                expect(response.status).toBe(200)
                expect(response.body.message).toBe("Deleted Post")
                expect(foundUserAfterDeletion.post).toHaveLength(expectedLen)
    
                expect(response.body).toMatchSnapshot()
            })

        })

    })
})