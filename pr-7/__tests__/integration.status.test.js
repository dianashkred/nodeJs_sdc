const request = require("supertest");
const { app } = require("../api-server");
const { JWT } = require("../auth/utils/jwt");
const { UserRole } = require("../models/enums/UserRole.enum");

describe("Status monitor access control", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test_secret";
    process.env.JWT_EXPIRES_IN = "1h";
  });

  const makeAuthHeader = (role) => {
    const token = JWT.sign({ id: "u1", email: "a@test.com", role });
    return `Bearer ${token}`;
  };

  test("GET /status -> 401 without token", async () => {
    const res = await request(app).get("/status");
    expect(res.statusCode).toBe(401);
  });

  test("GET /status -> accessible with ADMIN", async () => {
    const res = await request(app)
      .get("/status")
      .set("Authorization", makeAuthHeader(UserRole.ADMIN));

    expect(res.statusCode).not.toBe(401);
    expect(res.statusCode).not.toBe(403);
  });

  test("GET /status -> 403 with TEACHER", async () => {
    const res = await request(app)
      .get("/status")
      .set("Authorization", makeAuthHeader(UserRole.TEACHER));

    expect(res.statusCode).toBe(403);
  });
});
