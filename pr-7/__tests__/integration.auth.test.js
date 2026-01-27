const request = require("supertest");
const express = require("express");
const { AuthController } = require("../auth/auth.controller");

const app = express();
const authController = new AuthController();

app.use(express.json());
app.post("/login", authController.login);
app.post("/registration", authController.registration);

describe("Auth integration", () => {
  test("POST /login validation error", async () => {
    const res = await request(app).post("/login").send({});
    expect(res.statusCode).toBe(400);
  });
});

/*
const request = require("supertest");
const app = require("../../server");

describe("Auth integration tests", () => {
  test("POST /registration", async () => {
    const res = await request(app).post("/registration").send({
      name: "Test",
      surname: "User",
      email: "test@test.com",
      password: "123456",
    });

    expect([200, 409]).toContain(res.statusCode);
  });

  test("POST /login", async () => {
    const res = await request(app).post("/login").send({
      email: "test@test.com",
      password: "123456",
    });

    expect([200, 401, 403]).toContain(res.statusCode);
  });
});

*/