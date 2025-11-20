const path = require("path");
const StudentService = require("./services/StudentService");
const Logger = require("./logger/Logger");
const CLI = require("./services/CLIService");
const BackupService = require("./services/BackupService");
const registerEventLogger = require("./events/eventLogger");

async function main() {
  const logger = new Logger(CLI.verbose, CLI.quiet);
  const studentService = new StudentService(logger);

  registerEventLogger(logger);

  const backupService = new BackupService({
    studentService,
    backupDir: path.join(__dirname, "./storage/backups"),
    intervalMs: 5000,
    logger
  });

  try {
    await studentService.loadFromFile();

    studentService.addStudent("John Doe", 20, 2);
    studentService.addStudent("Jane Smith", 23, 3);
    studentService.addStudent("Mike Johnson", 18, 2);

    logger.log("All students:", studentService.getAllStudents());
    logger.log("Average age:", studentService.calculateAverageAge());

    await studentService.saveToFile();

    setTimeout(() => {
      backupService.stop();
      logger.log("Exiting application.");
      process.exit(0);
    }, 20000);
  } catch (error) {
    logger.log("Fatal error:", error);
    backupService.stop();
    process.exit(1);
  }
}

main();
