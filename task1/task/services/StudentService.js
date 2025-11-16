const Student = require("../models/Student");
const FileService = require("./FileService");

class StudentService {
  constructor(logger) {
    this.logger = logger;
    this.students = [];
    this.filePath = __dirname + "/../storage/students.json";
  }

  loadFromFile() {
    this.students = FileService.loadFromJSON(this.filePath).map(
      (s) => new Student(s.id, s.name, s.age, s.group)
    );
    this.logger.log("Students loaded:", this.students.length);
  }

  saveToFile() {
    FileService.saveToJSON(this.students, this.filePath);
    this.logger.log("Students saved:", this.students.length);
  }

  addStudent(name, age, group) {
    const id = String(Date.now());
    const student = new Student(id, name, age, group);
    this.students.push(student);
    this.logger.log("Added student:", student);
    return student;
  }

  removeStudent(id) {
    const idx = this.students.findIndex((s) => s.id === id);
    if (idx === -1) return false;

    this.students.splice(idx, 1);
    this.logger.log("Removed student with id:", id);
    return true;
  }

  getStudentById(id) {
    return this.students.find((s) => s.id === id) || null;
  }

  getStudentsByGroup(group) {
    return this.students.filter((s) => s.group === group);
  }

  getAllStudents() {
    return [...this.students];
  }

  calculateAverageAge() {
    if (this.students.length === 0) return 0;
    const sum = this.students.reduce((acc, s) => acc + s.age, 0);
    return sum / this.students.length;
  }
}

module.exports = StudentService;
