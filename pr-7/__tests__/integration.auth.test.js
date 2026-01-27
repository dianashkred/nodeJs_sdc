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

