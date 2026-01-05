const DatabaseClient = require("../database/database.client");

class StudentDbService {
  constructor() {
    this.db = DatabaseClient.getInstance();
  }

  async getAllStudents() {
    const res = await this.db.query(
      "SELECT id, name, age, group_number FROM students;"
    );
    return res.rows;
  }

  async getStudentById(id) {
    const res = await this.db.query(
      "SELECT id, name, age, group_number FROM students WHERE id = $1;",
      [id]
    );
    return res.rows[0] || null;
  }

  async addStudent(student) {
    const res = await this.db.query(
      `INSERT INTO students (id, name, age, group_number)
       VALUES ($1, $2, $3, $4)
       RETURNING *;`,
      [student.id, student.name, student.age, student.group]
    );
    return res.rows[0];
  }

  async updateStudentById(id, data) {
    const res = await this.db.query(
      `UPDATE students
       SET name = COALESCE($1, name),
           age = COALESCE($2, age),
           group_number = COALESCE($3, group_number)
       WHERE id = $4
       RETURNING *;`,
      [data.name?? null, data.age?? null, data.group?? null, id]
    );
    return res.rows[0] || null;
  }

  async removeStudentById(id) {
    const res = await this.db.query(
      "DELETE FROM students WHERE id = $1 RETURNING *;",
      [id]
    );
    return res.rows[0] || null;
  }

  async replaceAllStudents(students) {
    await this.db.query("BEGIN");
    try {
      await this.db.query("DELETE FROM students;");

      for (const s of students) {
        await this.addStudent(s);
      }

      await this.db.query("COMMIT");
    } catch (e) {
      await this.db.query("ROLLBACK");
      throw e;
    }
  }

  async getStudentsByGroup(groupId) {
    const res = await this.db.query(
      "SELECT * FROM students WHERE group_number = $1;",
      [groupId]
    );
    return res.rows;
  }

  async getAverageAge() {
    const res = await this.db.query(
      "SELECT AVG(age) AS avg FROM students;"
    );
    return Number(res.rows[0].avg);
  }
}

module.exports = StudentDbService;
