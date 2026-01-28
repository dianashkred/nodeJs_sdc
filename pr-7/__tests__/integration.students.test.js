const request = require("supertest");
const { app } = require("../api-server");
const { JWT } = require("../auth/utils/jwt");
const { UserRole } = require("../models/enums/UserRole.enum");

describe("Students API integration (real app pipeline)", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test_secret";
    process.env.JWT_EXPIRES_IN = "1h";
  });

  const makeAuthHeader = (role = UserRole.ADMIN) => {
    const token = JWT.sign({ id: "test-user", email: "t@test.com", role });
    return `Bearer ${token}`;
  };

  test("GET /api/students -> 401 without token", async () => {
    const res = await request(app).get("/api/students");
    expect(res.statusCode).toBe(401);
  });

  test("GET /api/students -> 200 with ADMIN", async () => {
    const res = await request(app)
      .get("/api/students")
      .set("Authorization", makeAuthHeader(UserRole.ADMIN));

    expect(res.statusCode).toBe(200);
  });

  test("GET /api/students -> 403 with STUDENT", async () => {
    const res = await request(app)
      .get("/api/students")
      .set("Authorization", makeAuthHeader(UserRole.STUDENT));

    expect(res.statusCode).toBe(403);
  });
});
