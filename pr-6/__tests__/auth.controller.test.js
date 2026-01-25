const request = require("supertest");
const app = require("../app");

describe("POST /login", () => {
  it("should return a 200 and a token when valid credentials are provided", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: "test@example.com",
        password: "password123"
      });
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
  });
});

describe("POST /registration", () => {
  it("should return 201 when new user is registered", async () => {
    const response = await request(app)
      .post("/registration")
      .send({
        name: "John",
        surname: "Doe",
        email: "john.doe@example.com",
        password: "password123"
      });
    expect(response.status).toBe(201);
  });
});
