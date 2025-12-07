const express = require("express");
const cors = require("cors");
const path = require("path");

const StudentService = require("./services/StudentService");
const BackupService = require("./services/BackupService");
const Logger = require("./logger/Logger");
const registerEventLogger = require("./events/eventLogger");
const CLI = require("./services/CLIService");

const app = express();
const PORT = 3001;

app.use(cors());

app.use(express.json());

const logger = new Logger(CLI.verbose, CLI.quiet);
const studentService = new StudentService(logger);
registerEventLogger(logger);

studentService.loadFromFile();

const backupService = new BackupService({
  studentService,
  backupDir: path.join(__dirname, "./storage/backups"),
  intervalMs: 5000,
  logger
});


backupService.stop();


app.get("/api/students", (req, res) => {
  res.json(studentService.getAllStudents());
});


app.post("/api/students", (req, res) => {
  const { name, age, group } = req.body;
  const student = studentService.addStudent(name, age, group);
  res.status(201).json(student);
});

app.put("/api/students", (req, res) => {
  const newStudents = req.body;

  studentService.students = newStudents;
  res.json({ message: "Collection replaced", count: newStudents.length });
});


app.put("/api/students/:id", (req, res) => {
  const id = req.params.id;
  const student = studentService.getStudentById(id);

  if (!student) return res.status(404).json({ error: "Student not found" });

  const { name, age, group } = req.body;

  student.name = name ?? student.name;
  student.age = age ?? student.age;
  student.group = group ?? student.group;

  res.json(student);
});

app.delete("/api/students/:id", (req, res) => {
  const success = studentService.removeStudent(req.params.id);

  if (!success) return res.status(404).json({ error: "Student not found" });
  res.json({ message: "Student removed" });
});

app.get("/api/students/average-age", (req, res) => {
  res.json({ averageAge: studentService.calculateAverageAge() });
});

app.get("/api/students/group/:id", (req, res) => {
  const groupId = Number(req.params.id);
  const students = studentService.getStudentsByGroup(groupId);
  res.json(students);
});


app.get("/api/students/:id", (req, res) => {
  const student = studentService.getStudentById(req.params.id);

  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(student);
});

app.post("/api/students/save", async (req, res) => {
  await studentService.saveToFile();
  res.json({ message: "Saved" });
});


app.post("/api/students/load", async (req, res) => {
  await studentService.loadFromFile();
  res.json({ message: "Loaded" });
});

app.post("/api/backup/start", (req, res) => {
  backupService.start();
  res.json({ message: "Backup started" });
});

app.post("/api/backup/stop", (req, res) => {
  backupService.stop();
  res.json({ message: "Backup stopped" });
});

app.get("/api/backup/status", (req, res) => {
  res.json({
    isRunning: Boolean(backupService.intervalId),
    pendingIntervals: backupService.pendingIntervals
  });
});


app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
