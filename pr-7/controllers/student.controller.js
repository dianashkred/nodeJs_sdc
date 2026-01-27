const StudentDbService = require("../services/StudentDbService");
const { UpdateStudentSchema, CreateStudentSchema } = require("../models/Student.validation");
const fs = require("fs/promises");
const path = require("path");

class StudentController {
  constructor() {
    this.service = new StudentDbService();
  }

  getAll = async (_, res) => {
    res.json(await this.service.getAllStudents());
  };

  getById = async (req, res) => {
    const s = await this.service.getStudentById(req.params.id);
    if (!s) return res.status(404).send("Not found");
    res.json(s);
  };

  add = async (req, res) => {
    const { error, value } = CreateStudentSchema.validate(req.body);
    if (error) return res.status(400).json(error.details.map(d => d.message));

    const student = {
      id: String(Date.now()),
      ...value
    };

    res.status(201).json(await this.service.addStudent(student));
  };

  updateById = async (req, res) => {
    const { error, value } = UpdateStudentSchema.validate(req.body);
    if (error) return res.status(400).json(error.details.map(d => d.message));

    const updated = await this.service.updateStudentById(req.params.id, value);
    if (!updated) return res.status(404).send("Not found");
    res.json(updated);
  };

  removeById = async (req, res) => {
    const removed = await this.service.removeStudentById(req.params.id);
    if (!removed) return res.status(404).send("Not found");
    res.json(removed);
  };

  replaceAll = async (req, res) => {
    if (!Array.isArray(req.body)) {
      return res.status(400).send("Array expected");
    }
    await this.service.replaceAllStudents(req.body);
    res.json({ message: "Collection replaced" });
  };

  byGroup = async (req, res) => {
    res.json(await this.service.getStudentsByGroup(Number(req.params.id)));
  };

  averageAge = async (_, res) => {
    res.json({ averageAge: await this.service.getAverageAge() });
  };

  saveToJson = async (_, res) => {
    const data = await this.service.getAllStudents();
    await fs.writeFile(
      path.join(__dirname, "../storage/students.json"),
      JSON.stringify(data, null, 2)
    );
    res.json({ message: "Saved to JSON" });
  };

  loadFromJson = async (_, res) => {
    const raw = await fs.readFile(
      path.join(__dirname, "../storage/students.json"),
      "utf-8"
    );
    const students = JSON.parse(raw);
    await this.service.replaceAllStudents(students);
    res.json({ message: "Loaded from JSON" });
  };
}

module.exports = StudentController;
