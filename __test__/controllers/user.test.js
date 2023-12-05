const app = require("../../src/app")
const { MongoMemoryServer } = require("mongodb-memory-server");
const supertest = require("supertest");
const mongoose = require("mongoose")
const User = require("../../src/models/user")

const userPayload = {
    "username": "jessie",
    "password": "password"
}

let userId
let token

describe("user.js", () => {

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        // create User
        const response = await supertest(app)
            .post("/api/v1/auth/signup")
            .send(userPayload)

        token = response.body.token

        const foundUser = await User.findOne({
            "username": userPayload.username
        })

        userId = foundUser._id.toString()
    })
    
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    describe("given user does not exist and userId", () => {
        it("should return 404", async () => {
            // act
            const fakeUserId = new mongoose.Types.ObjectId().toString();

            const response = await supertest(app)
            .get(`/api/v1/user/${fakeUserId}`)

            // expectation
            expect(response.status).toBe(404)
            expect(response.body).toMatchSnapshot()
        })
    })

    describe("given user exist and userId", () => {
        it("should return 200 and username if user exists", async () => {
            const response = await supertest(app)
            .get(`/api/v1/user/${userId}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("username", userPayload.username);
        });
    })

})
