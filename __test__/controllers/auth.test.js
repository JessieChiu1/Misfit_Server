const app = require("../../src/app")
const { MongoMemoryServer } = require("mongodb-memory-server");
const supertest = require("supertest");
const mongoose = require("mongoose")
const dotenv = require("dotenv/config");

const userPayload = {
    username: "jessie",
    password: "password",
}

const invalidPayload = {
    username: "wrongUsername",
    password: "wrongPassword",
}

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
        describe("given userPayload", () => {
            it("should return 200 and jwt", async () => {
                const response = await supertest(app)
                    .post("/api/v1/auth/signup")
                    .send(userPayload)
                // expectation
                expect(response.status).toBe(200)
                expect(response.body).toHaveProperty("token");
                expect(typeof response.body.token).toBe("string")
                // snapshot
                expect(response.body).toMatchSnapshot({
                    "token": expect.any(String)
                })
            })
        })
    })

    describe("login", () => {
        describe("given an invalid userPayload", () => {
            it("should return 400", async () => {
                // act
                const response = await supertest(app)
                    .post("/api/v1/auth/login")
                    .send(invalidPayload)
                // expectation
                expect(response.status).toBe(400)
                // snapshot
                expect(response.body).toMatchSnapshot()
            })
        })
        describe("given a valid userPayload", () => {
            it("should return 400", async () => {
                // act
                const response = await supertest(app)
                    .post("/api/v1/auth/login")
                    .send(userPayload)
                // expectation
                expect(response.status).toBe(200)
                expect(response.body).toHaveProperty("token");
                expect(typeof response.body.token).toBe("string")
                // snapshot
                expect(response.body).toMatchSnapshot({
                    "token": expect.any(String)
                })
            })
        })
    })
})
