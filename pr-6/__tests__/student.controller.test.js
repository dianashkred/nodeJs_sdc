const request = require("supertest");
const app = require("../api-server");


afterAll((done) => {
  app.close(done);
});

describe("POST /students", () => {
  it("should add a new student and return status 201", async () => {
    const response = await request(app)
      .post("/students")
      .send({
        name: "John Doe",
        age: 22,
        group: 1
      });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe("John Doe");
  });
});

describe("GET /students/:id", () => {
  it("should return a student by ID", async () => {
    const student = await request(app)
      .post("/students")
      .send({
        name: "Jane Doe",
        age: 21,
        group: 1
      });

    const response = await request(app)
      .get(`/students/${student.body.id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Jane Doe");
  });

  it("should return 404 when student is not found", async () => {
    const response = await request(app)
      .get("/students/invalid-id");
    expect(response.status).toBe(404); 
  });
});

describe("PUT /students/:id", () => {
  it("should update student information", async () => {
    const student = await request(app)
      .post("/students")
      .send({
        name: "Tommy",
        age: 20,
        group: 2
      });

    const response = await request(app)
      .put(`/students/${student.body.id}`)
      .send({
        name: "Tommy Updated",
        age: 21,
        group: 2
      });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Tommy Updated");
  });
});

describe("DELETE /students/:id", () => {
  it("should delete student by ID", async () => {
    const student = await request(app)
      .post("/students")
      .send({
        name: "John Doe",
        age: 23,
        group: 1
      });

    const response = await request(app)
      .delete(`/students/${student.body.id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("John Doe");
  });
});

describe("GET /students", () => {
  it("should return a list of students", async () => {
    const response = await request(app).get("/students");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
describe("POST /students with invalid data", () => {
  it("should return 400 if name is missing", async () => {
    const response = await request(app)
      .post("/students")
      .send({
        age: 22,
        group: 1
      });
    expect(response.status).toBe(400);
    expect(response.body).toContain("name is required");
  });

  it("should return 404 if trying to update a non-existent student", async () => {
    const response = await request(app)
      .put("/students/invalid-id")
      .send({
        name: "Updated Name",
        age: 25
      });
    expect(response.status).toBe(404);
  });
});
