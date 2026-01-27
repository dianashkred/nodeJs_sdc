const { JWT } = require("../auth/utils/jwt");

describe("JWT utils", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test_secret";
    process.env.JWT_EXPIRES_IN = "1h";
  });

  test("should sign and verify token", () => {
    const payload = { id: "1", email: "a@test.com", role: "ADMIN" };
    const token = JWT.sign(payload);
    const decoded = JWT.verify(token);

    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  test("verify returns null for invalid token", () => {
    const result = JWT.verify("invalid");
    expect(result).toBeNull();
  });
});
