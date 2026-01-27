const StudentService = require("../services/StudentService");

describe("StudentService", () => {
  const logger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  const service = new StudentService(logger);

  test("addStudent adds student", () => {
    const s = service.addStudent("John", 20, 1);
    expect(s.name).toBe("John");
  });

  test("calculateAverageAge", () => {
    service.addStudent("A", 20, 1);
    service.addStudent("B", 30, 1);

    expect(service.calculateAverageAge()).toBe(25);
 });
  test("calculateAverageAge returns 0 if no students", () => {
    const emptyService = new StudentService(logger);
    expect(emptyService.calculateAverageAge()).toBe(0);
 });

 
});
