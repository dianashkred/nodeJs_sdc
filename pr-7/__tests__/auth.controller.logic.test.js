const bcrypt = require("bcrypt");
const { AuthController } = require("../auth/auth.controller");

describe("AuthController static logic", () => {
  test("hashPassword hashes password", async () => {
    const hash = await AuthController.hashPassword("password");
    expect(await bcrypt.compare("password", hash)).toBe(true);
  });

  test("isPasswordMatches returns true for correct password", async () => {
    const hash = await bcrypt.hash("123", 10);
    const result = await AuthController.isPasswordMatches("123", hash);
    expect(result).toBe(true);
  });
});
