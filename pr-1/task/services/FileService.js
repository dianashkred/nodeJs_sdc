const fs = require("fs");

class FileService {
  static saveToJSON(data, filePath) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  static loadFromJSON(filePath) {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  }
}

module.exports = FileService;
