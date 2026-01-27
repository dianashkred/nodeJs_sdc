const fs = require("fs/promises");
const path = require("path");
const FileService = require("../services/FileService");

describe("FileService", () => {
  const filePath = path.join(__dirname, "test.json");

  afterEach(async () => {
    try {
      await fs.unlink(filePath);
    } catch {}
  });

  test("saveToJSON & loadFromJSON", async () => {
    const data = [{ a: 1 }];
    await FileService.saveToJSON(data, filePath);

    const loaded = await FileService.loadFromJSON(filePath);
    expect(loaded).toEqual(data);
  });
});
