const request = require("supertest");
const { app } = require("../api-server");

describe("Auth integration", () => {
  test("POST /login -> 400 validation error", async () => {
    const res = await request(app).post("/login").send({});
    expect(res.statusCode).toBe(400);
  });

  test("POST /registration -> 400 validation error", async () => {
    const res = await request(app).post("/registration").send({});
    expect(res.statusCode).toBe(400);
  });
});
