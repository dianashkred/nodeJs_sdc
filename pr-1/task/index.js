const StudentService = require("./services/StudentService");
const Logger = require("./logger/Logger");
const CLI = require("./services/CLIService");

const logger = new Logger(CLI.verbose, CLI.quiet);
const studentService = new StudentService(logger);

// Load existing students
studentService.loadFromFile();

// Add demo students
studentService.addStudent("John Doe", 20, 2);
studentService.addStudent("Jane Smith", 23, 3);
studentService.addStudent("Mike Johnson", 18, 2);


// Display all
logger.log("All students:", studentService.getAllStudents());

// Average age
logger.log("Average age:", studentService.calculateAverageAge());

// Save back to file
studentService.saveToFile();
