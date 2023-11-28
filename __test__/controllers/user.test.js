const app = require("../../src/app")
const { MongoMemoryServer } = require("mongodb-memory-server");
const supertest = require("supertest");
const mongoose = require("mongoose")
const dotenv = require("dotenv/config");
const jwt = require("jsonwebtoken")
const User = require("../../src/models/user")



describe("user.js", () => {

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });
    
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    describe("user page", () => {
        const payload = {
            "username": "jessie",
            "password": "password"
        }
        let id
        let token

        describe("when user is signed in", () => {
            beforeEach(async() => {
                // delete the user if it exist
                await User.findOneAndDelete({
                    "username": payload.username,
                })
                // create user and get token
                const response = await supertest(app).post("/api/v1/auth/signup").send(payload)
                token = response.body.token
                
                const foundUser = await User.findOne({
                    "username": payload.username
                })

                id = foundUser._id.toString()
            })
            it("response correctly when user is sign in", async() => {
                // act
                const response = await supertest(app)
                    .get(`/api/v1/user/${id}`)
                    .set({"Authorization": `Bearer ${token}`})
                // expectation
                // check out snapshot
                // you don't want to have to edit the test case every time you change the original function
                expect(response.status).toBe(200)
                expect(response.body).toHaveProperty("username")
                expect(typeof response.body.username).toBe("string")

            })
        })
    })
})
