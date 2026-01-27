const { UserRole } = require("../enums/UserRole.enum");

class User {
  constructor(id, name, surname, email, passwordHash, role) {
    if (!Object.values(UserRole).includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }

    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
  }
}

module.exports = { User };
