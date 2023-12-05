const request = require("supertest")
const app = require("../src/app")

describe("app.js", () => {
    it("response correctly when processing the home route", async() => {
        //act
        const response = await request(app).get("/")
        // expectation
        expect(response.status).toBe(200)
        expect(response.text).toBe("okay")
        expect(response.text).toMatchSnapshot()
    })
})