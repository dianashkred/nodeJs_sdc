const request = require("supertest");
const express = require("express");
const studentsRouter = require("../routes/students.router");

const app = express();
app.use(express.json());
app.use("/api/students", studentsRouter);

describe("Students API integration", () => {
  test("GET /api/students", async () => {
    const res = await request(app).get("/api/students");
    expect(res.statusCode).toBe(200);
  });
});


/*const request = require("supertest");
const app = require("../../server");

describe("Students API", () => {
  test("GET /api/students without token -> 401", async () => {
    const res = await request(app).get("/api/students");
    expect(res.statusCode).toBe(401);
  });
});
*/