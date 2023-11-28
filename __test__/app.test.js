const request = require("supertest")
const app = require("../src/app")

describe("app.js", () => {
    it("response correctly when processing the home route", async() => {
        // 1. setup 

        // 2. act/action
        const response = await request(app).get("/")
        // 3. expectation
        expect(response.status).toBe(200)
        expect(response.text).toBe("okay")
    })
})