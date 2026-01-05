const { Router } = require("express");
const StudentController = require("../controllers/student.controller");

const r = Router();
const c = new StudentController();

r.get("/", c.getAll);
r.post("/", c.add);
r.put("/", c.replaceAll);

r.get("/average-age", c.averageAge);
r.get("/group/:id", c.byGroup);

r.get("/:id", c.getById);
r.put("/:id", c.updateById);
r.delete("/:id", c.removeById);

r.post("/save", c.saveToJson);
r.post("/load", c.loadFromJson);

module.exports = r;
