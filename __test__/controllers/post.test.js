const app = require("../../src/app")
const { MongoMemoryServer } = require("mongodb-memory-server");
const supertest = require("supertest");
const mongoose = require("mongoose")
const dotenv = require("dotenv/config");
const jwt = require("jsonwebtoken")
const User = require("../../src/models/user")
const Post = require("../../src/models/post")

describe("post.js", () => {

    let token

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        await mongoose.connect(mongoServer.getUri())
        // create User
        payload = {
            username: "jessie",
            password: "password",
        }
        const response = await supertest(app).post("/api/v1/auth/signup").send(payload)
        token = response.body.token
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })

    describe("creating a new post", () => {
        // setup
        // write test post payload
        const payload = {
            "title": "blue hat",
            "type": "Accessory",
            "review": "awesome",
            "style": "Androgynous",
            "price": 25
        }

        it("response correctly when creating a new post", async () => {
            // act
            const response = await supertest(app).post(`/api/v1/post`).send(payload).set({ "Authorization": `Bearer ${token}` })

            const foundUser = await User.findOne({
                username: "jessie"
            })

            // expectation
            // check status code, message, user is also updated
            expect(response.status).toBe(200)
            expect(response.body.title).toBe("blue hat")
            expect(response.body.type).toBe("Accessory")
            expect(response.body.review).toBe("awesome")
            expect(response.body.style).toBe("Androgynous")
            expect(response.body.price).toBe(25)
            expect(response.body).toHaveProperty("_id")
            expect(foundUser.post).toHaveLength(1)
            
        })

    })

    describe("finding a post", () => {
        // setup
        let id
        // write test post payload
        const payload = {
            "title": "red hat",
            "type": "Accessory",
            "review": "awesome",
            "style": "Androgynous",
            "price": 25
        }

        beforeEach(async () => {
            // creating a test post
            const response = await supertest(app).post(`/api/v1/post`).send(payload).set({ "Authorization": `Bearer ${token}` })

            id = response.body._id.toString()
        })

        it("response correctly when finding post", async () => {
            // act
            const response = await supertest(app).get(`/api/v1/post/${id}`)
            // expectation
            // check status code, output
            expect(response.status).toBe(200)
            expect(response.body.title).toBe("red hat")
        })
    })

    describe("updating a post", () => {
        // setup
        let id

        // write payload
        const payload = {
            "title": "blue hat",
            "type": "Accessory",
            "review": "awesome",
            "style": "Androgynous",
            "price": 25
        }

        const newPayload = {
            "title": "test hat",
            "type": "Accessory",
            "review": "testing testing",
            "style": "Androgynous",
            "price": 10
        }

        // create the post
        beforeEach(async () => {
            // creating a test post
            const response = await supertest(app).post(`/api/v1/post`).send(payload).set({ "Authorization": `Bearer ${token}` })

            id = response.body._id.toString()
        })        

        it("response correctly when post is updated", async () => {
            // act
            const response = await supertest(app).put(`/api/v1/post/${id}`).send(newPayload).set({ "Authorization": `Bearer ${token}` })
            // expectation
            // check status code, message/output
            expect(response.status).toBe(200)
            expect(response.body.title).toBe("test hat")
            expect(response.body.type).toBe("Accessory")
            expect(response.body.review).toBe("testing testing")
            expect(response.body.style).toBe("Androgynous")
            expect(response.body.price).toBe(10)
        })
    })

    describe("deleting a post", () => {
        // setup
        let id

        // write payload
        const payload = {
            "title": "blue hat",
            "type": "Accessory",
            "review": "awesome",
            "style": "Androgynous",
            "price": 25
        }

        // create the post
        beforeEach(async () => {
            // creating a test post
            const response = await supertest(app).post(`/api/v1/post`).send(payload).set({ "Authorization": `Bearer ${token}` })

            id = response.body._id.toString()
        })  

        it("response correctly when post is deleted", async () => {
            // act
            // testing that User has 1 post before deleting
            const foundUser = await User.findOne({
                username: "jessie"
            })
            expect(foundUser.post).toHaveLength(1)
            
            const response = (await supertest(app).delete(`api/v1/post/${id}`)).set({ "Authorization": `Bearer ${token}` })

            // expectation
            // check status code, response message, user's post property is also updated
            expect(response.status).toBe(200)
            expect(response.body.message).toBe("Deleted Post")
            // testing that User has no more post after deleting
            expect(foundUser.post).toHaveLength(0)


        })

    })
})