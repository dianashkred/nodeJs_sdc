const { Router } = require("express");
const StudentController = require("../controllers/student.controller");

const { roleGuard } = require("../auth/guard/role.guard");
const { UserRole } = require("../models/enums/UserRole.enum");

const r = Router();
const c = new StudentController();

r.get("/", roleGuard([UserRole.ADMIN, UserRole.TEACHER]), c.getAll);
r.post("/", roleGuard([UserRole.ADMIN, UserRole.TEACHER]), c.add);
r.put("/", roleGuard([UserRole.ADMIN]), c.replaceAll);

r.get("/average-age", roleGuard([UserRole.ADMIN, UserRole.TEACHER]), c.averageAge);
r.get("/group/:id", roleGuard([UserRole.ADMIN, UserRole.TEACHER]), c.byGroup);

r.get("/:id", roleGuard([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]), c.getById);
r.put("/:id", roleGuard([UserRole.ADMIN, UserRole.TEACHER]), c.updateById);
r.delete("/:id", roleGuard([UserRole.ADMIN]), c.removeById);

r.post("/save", roleGuard([UserRole.ADMIN]), c.saveToJson);
r.post("/load", roleGuard([UserRole.ADMIN]), c.loadFromJson);

module.exports = r;
