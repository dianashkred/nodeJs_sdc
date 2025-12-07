const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");

class FileService {
  static async saveToJSON(data, filePath) {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    const json = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, json, "utf-8");
  }

  static async loadFromJSON(filePath) {
    if (!fsSync.existsSync(filePath)) {
      return [];
    }

    const raw = await fs.readFile(filePath, "utf-8");
    if (!raw.trim()) {
      return [];
    }

    return JSON.parse(raw);
  }
}

module.exports = FileService;
