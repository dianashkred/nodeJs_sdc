const { authTokenGuard } = require("../auth/guard/authToken.guard");
const { JWT } = require("../auth/utils/jwt");

jest.mock("../auth/utils/jwt");

describe("authTokenGuard", () => {
  test("401 if no auth header", () => {
    const req = { headers: {} };
    const res = { sendStatus: jest.fn() };

    authTokenGuard(req, res, jest.fn());
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  test("401 if token invalid", () => {
    JWT.verify.mockReturnValue(null);

    const req = {
      headers: { authorization: "Bearer token" },
    };
    const res = { sendStatus: jest.fn() };

    authTokenGuard(req, res, jest.fn());
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  test("sets req.user and calls next on success", () => {
    JWT.verify.mockReturnValue({ id: "1", role: "ADMIN" });

    const req = {
      headers: { authorization: "Bearer token" },
    };
    const res = {};
    const next = jest.fn();

    authTokenGuard(req, res, next);
    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
  });
});
