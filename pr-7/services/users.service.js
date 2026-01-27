const DatabaseClient = require("../database/database.client");
const { User } = require("../models/User/User");

class UsersService {
  constructor() {
    this.dbClient = DatabaseClient.getInstance();
  }

  async getUserById(id) {
    const result = await this.dbClient.query(
      `SELECT id, name, surname, email, password_hash, role
       FROM users
       WHERE id = $1;`,
      [id]
    );

    const row = result.rows[0];
    if (!row) return null;

    return new User(
      row.id,
      row.name,
      row.surname,
      row.email,
      row.password_hash,
      row.role
    );
  }

  async getUserByEmail(email) {
    const result = await this.dbClient.query(
      `SELECT id, name, surname, email, password_hash, role
       FROM users
       WHERE email = $1;`,
      [email]
    );

    const row = result.rows[0];
    if (!row) return null;

    return new User(
      row.id,
      row.name,
      row.surname,
      row.email,
      row.password_hash,
      row.role
    );
  }

  async addNewUser(user) {
    const result = await this.dbClient.query(
      `INSERT INTO users (id, name, surname, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, surname, email, role;`,
      [
        user.id,
        user.name,
        user.surname,
        user.email,
        user.passwordHash,
        user.role,
      ]
    );

    return result.rows[0];
  }
}

module.exports = { UsersService };
