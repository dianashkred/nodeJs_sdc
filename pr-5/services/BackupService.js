const fs = require("fs/promises");
const path = require("path");
const FileService = require("./FileService");
const appEvents = require("../events/appEvents");

class BackupService {
  constructor(options) {
    const {
      studentService,
      backupDir,
      intervalMs = 5000,
      logger
    } = options;

    this.studentService = studentService;
    this.backupDir = backupDir;
    this.intervalMs = intervalMs;
    this.logger = logger;

    this.isPending = false;
    this.pendingIntervals = 0;
    this.intervalId = null;

    this.start();
  }

  async ensureBackupDirExists() {
    await fs.mkdir(this.backupDir, { recursive: true });
  }

  start() {
    if (this.intervalId) {
      return;
    }

    this.intervalId = setInterval(() => {
      this.handleInterval().catch((err) => {
        this.logger.log("Unhandled backup interval error:", err);
      });
    }, this.intervalMs);

    this.logger.log(
      "Backup service started with interval (ms):",
      this.intervalMs
    );
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.logger.log("Backup service stopped.");
      appEvents.emit("backup:stopped");
    }
  }

  async handleInterval() {
    if (this.isPending) {
      this.pendingIntervals += 1;
      this.logger.log(
        "Backup skipped: previous I/O still pending. Pending intervals:",
        this.pendingIntervals
      );

      if (this.pendingIntervals >= 3) {
        const error = new Error(
          "Backup error: I/O operation pending for 3 intervals in a row."
        );
        appEvents.emit("backup:error", error);
        this.logger.log(error);
        this.stop();
      }

      return;
    }

    this.isPending = true;
    this.pendingIntervals = 0;

    try {
      await this.ensureBackupDirExists();
      await this.runBackup();
    } catch (error) {
      appEvents.emit("backup:error", error);
      this.logger.log("Backup error:", error);
    } finally {
      this.isPending = false;
    }
  }

  async runBackup() {
    const students = this.studentService.getAllStudents();
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const fileName = `${timestamp}.backup.json`;
    const filePath = path.join(this.backupDir, fileName);

    await FileService.saveToJSON(students, filePath);

    this.logger.log(
      "Backup completed.",
      "File:",
      filePath,
      "Students:",
      students.length
    );

    appEvents.emit("backup:success", {
      filePath,
      fileName,
      studentsCount: students.length,
      timestamp: new Date()
    });
  }
}

module.exports = BackupService;
