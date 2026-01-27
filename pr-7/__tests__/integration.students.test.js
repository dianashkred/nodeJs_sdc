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


