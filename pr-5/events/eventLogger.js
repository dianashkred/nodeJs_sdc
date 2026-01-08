const appEvents = require("./appEvents");

function registerEventLogger(logger) {
  appEvents.on("students:loaded", (students) => {
    logger.log("Event: students loaded, count:", students.length);
  });

  appEvents.on("students:saved", (students) => {
    logger.log("Event: students saved, count:", students.length);
  });

  appEvents.on("student:added", (student) => {
    logger.log("Event: student added:", student);
  });

  appEvents.on("student:removed", (student) => {
    logger.log("Event: student removed:", student);
  });

  appEvents.on("student:requested", ({ id, found }) => {
    logger.log("Event: student requested:", id, "found:", found);
  });

  appEvents.on("students:byGroup", ({ group, count }) => {
    logger.log("Event: students by group:", group, "count:", count);
  });

  appEvents.on("students:averageAgeCalculated", (averageAge) => {
    logger.log("Event: average age calculated:", averageAge);
  });

  appEvents.on("backup:success", (info) => {
    logger.log(
      "Event: backup success.",
      "File:",
      info.fileName,
      "Students:",
      info.studentsCount
    );
  });

  appEvents.on("backup:error", (error) => {
    logger.log("Event: backup error:", error.message);
  });

  appEvents.on("backup:stopped", () => {
    logger.log("Event: backup service stopped.");
  });
}

module.exports = registerEventLogger;
