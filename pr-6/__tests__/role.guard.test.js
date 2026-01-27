const { roleGuard } = require("../auth/guard/role.guard");

describe("roleGuard", () => {
  test("allows access for allowed role", () => {
    const req = { user: { role: "ADMIN" } };
    const res = {};
    const next = jest.fn();

    roleGuard(["ADMIN"])(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("denies access for wrong role", () => {
    const req = { user: { role: "STUDENT" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    roleGuard(["ADMIN"])(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test("returns 401 if user not present", () => {
    const req = {};
    const res = {
       sendStatus: jest.fn(),
    };

    roleGuard(["ADMIN"])(req, res, jest.fn());
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

});
