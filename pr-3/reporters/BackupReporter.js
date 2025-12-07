const fs = require("fs/promises");
const path = require("path");

async function runBackupReporter() {
  const backupDir = path.join(__dirname, "../storage/backups");

  await fs.mkdir(backupDir, { recursive: true });

  const files = await fs.readdir(backupDir);
  const backupFiles = files.filter((name) => name.endsWith(".backup.json"));

  if (backupFiles.length === 0) {
    console.log("No backup files found.");
    return;
  }

  const filePaths = backupFiles.map((name) => path.join(backupDir, name));

  const contents = await Promise.all(
    filePaths.map((filePath) => fs.readFile(filePath, "utf-8"))
  );

  const backups = contents.map((json) => JSON.parse(json));

  const totalFiles = backups.length;

  let totalStudentsAcrossFiles = 0;
  const countsById = new Map();

  backups.forEach((students) => {
    totalStudentsAcrossFiles += students.length;

    students.forEach((student) => {
      const current = countsById.get(student.id) || 0;
      countsById.set(student.id, current + 1);
    });
  });

  const averageStudents = totalStudentsAcrossFiles / totalFiles;

  const sortedBackupFiles = backupFiles.slice().sort();
  const latestFileName = sortedBackupFiles[sortedBackupFiles.length - 1];
  const latestFilePath = path.join(backupDir, latestFileName);
  const latestStat = await fs.stat(latestFilePath);
  const latestDate = latestStat.mtime.toISOString();

  const grouped = Array.from(countsById.entries()).map(([id, amount]) => ({
    id,
    amount
  }));

  console.log("=== Backup reporter result ===");
  console.log("Total backup files:", totalFiles);
  console.log("Latest backup file:", latestFileName);
  console.log("Latest backup datetime:", latestDate);
  console.log("Students grouped by id across all backups:");
  console.log(JSON.stringify(grouped, null, 2));
  console.log("Average number of students per backup file:", averageStudents);
}

if (require.main === module) {
  runBackupReporter().catch((error) => {
    console.error("Reporter error:", error);
    process.exit(1);
  });
}

module.exports = runBackupReporter;
