const app = require("../../src/app")
const { MongoMemoryServer } = require("mongodb-memory-server");
const supertest = require("supertest");
const mongoose = require("mongoose")
const User = require("../../src/models/user")
const dotenv = require("dotenv/config");


describe("auth.js", () => {

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        await mongoose.connect(mongoServer.getUri())
    });
    
    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    });

    describe("signup", () => {
        const payload = {}
        beforeEach(() => {
            payload.username = "jessie"
            payload.password = "password"
        })
        describe("with payload created successfully", () => {
            beforeEach(async () => {
                // clear DB of that user
                await User.findOneAndDelete({
                    "username": payload.username,
                })
            })
            // act
            it("responds correctly", async() => {
                const response = await supertest(app).post("/api/v1/auth/signup").send(payload)
                // expectation
                expect(response.status).toBe(200)
                expect(response.body).toHaveProperty("token");
                expect(typeof response.body.token).toBe("string")
            })
            })

    })

    describe("login", () => {
        const payload = {}
        beforeEach(() => {
            payload.username = "jessie"
            payload.password = "password"
        })
        describe("with payload created successfully", () => {
            it("response correctly", async() => {
                // act
                const response = await supertest(app).post("/api/v1/auth/login").send(payload)
                // expectation
                expect(response.status).toBe(200)
                expect(response.body).toHaveProperty("token");
                expect(typeof response.body.token).toBe("string")
            })
        })
    })
})
