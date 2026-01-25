const request = require("supertest");
const app = require("../api-server");
let server;
beforeAll(done => {
  // Запускаем сервер перед выполнением тестов
  server = app.listen(3000, done); // Порт можно настроить через переменную окружения или параметр
});
afterAll((done) => {
  app.close(done);
});

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

  it("should return 401 when an invalid email is provided", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: "wrongemail@example.com",
        password: "password123"
      });
    expect(response.status).toBe(401); 
  });

  it("should return 403 when an incorrect password is provided", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: "test@example.com",
        password: "wrongpassword"
      });
    expect(response.status).toBe(403);
  });
});

describe("POST /registration", () => {
  it("should return 201 when a new user is successfully registered", async () => {
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

  it("should return 409 when trying to register an existing user", async () => {
    await request(app)
      .post("/registration")
      .send({
        name: "Jane",
        surname: "Doe",
        email: "jane.doe@example.com",
        password: "password123"
      });

    const response = await request(app)
      .post("/registration")
      .send({
        name: "Jane",
        surname: "Doe",
        email: "jane.doe@example.com",
        password: "password123"
      });
    expect(response.status).toBe(409); 
  });
});
