const request = require("supertest");
const app = require("../api-server");

describe("GET /api-docs", () => {
  it("should return Swagger API docs", async () => {
    const response = await request(app).get("/api-docs");
    expect(response.status).toBe(200);
    expect(response.text).toContain("My API"); 
  });
});
