const path = require("path");
const Student = require("../models/Student");
const FileService = require("./FileService");
const appEvents = require("../events/appEvents");

class StudentService {
  constructor(logger) {
    this.logger = logger;
    this.students = [];
    this.filePath = path.join(__dirname, "../storage/students.json");
  }

  async loadFromFile() {
    const rawStudents = await FileService.loadFromJSON(this.filePath);

    this.students = rawStudents.map(
      (s) => new Student(s.id, s.name, s.age, s.group)
    );

    this.logger.log("Students loaded:", this.students.length);
    appEvents.emit("students:loaded", this.students);
  }

  async saveToFile() {
    await FileService.saveToJSON(this.students, this.filePath);
    this.logger.log("Students saved:", this.students.length);
    appEvents.emit("students:saved", this.students);
  }

  addStudent(name, age, group) {
    const id = String(Date.now());
    const student = new Student(id, name, age, group);
    this.students.push(student);

    this.logger.log("Added student:", student);
    appEvents.emit("student:added", student);

    return student;
  }

  removeStudent(id) {
    const index = this.students.findIndex((s) => s.id === id);
    if (index === -1) {
      this.logger.log("Student not found for removal, id:", id);
      return false;
    }

    const [removed] = this.students.splice(index, 1);
    this.logger.log("Removed student:", removed);
    appEvents.emit("student:removed", removed);

    return true;
  }

  getStudentById(id) {
    const student = this.students.find((s) => s.id === id) || null;
    appEvents.emit("student:requested", { id, found: Boolean(student) });
    return student;
  }

  getStudentsByGroup(group) {
    const result = this.students.filter((s) => s.group === group);
    appEvents.emit("students:byGroup", { group, count: result.length });
    return result;
  }

  getAllStudents() {
    return [...this.students];
  }

  calculateAverageAge() {
    if (this.students.length === 0) {
      return 0;
    }

    const sum = this.students.reduce((acc, s) => acc + s.age, 0);
    const average = sum / this.students.length;

    appEvents.emit("students:averageAgeCalculated", average);

    return average;
  }
}

module.exports = StudentService;
