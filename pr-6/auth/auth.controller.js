const bcrypt = require("bcrypt");
const crypto = require("crypto");

const { UsersService } = require("../services/Users.service");
const { UserRole } = require("../models/enums/UserRole.enum");
const {
  UserRegistrationSchema,
  UserLoginSchema,
} = require("../models/User/User.validation");
const { JWT } = require("./utils/jwt");
const { User } = require("../models/User/User");

class AuthController {
  constructor() {
    this.usersService = new UsersService();
  }

  login = async (req, res) => {
    const { error, value } = UserLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details.map((i) => i.message));
    }

    const user = await this.usersService.getUserByEmail(value.email);

    if (!user) {
      return res.status(401).send("User with such email was not found");
    }

    const ok = await AuthController.isPasswordMatches(
      value.password,
      user.passwordHash
    );

    if (!ok) {
      return res.status(403).send("Wrong password or email");
    }

    const token = JWT.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      accessToken: `Bearer ${token}`,
    });
  };

  registration = async (req, res) => {
    const { error, value } = UserRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details.map((i) => i.message));
    }

    const existing = await this.usersService.getUserByEmail(value.email);
    if (existing) {
      return res.status(409).send("User Already Exists");
    }

    const role = value.role || UserRole.STUDENT;
    const hashedPassword = await AuthController.hashPassword(value.password);

    const newUser = new User(
      AuthController.generateUUID(),
      value.name,
      value.surname,
      value.email,
      hashedPassword,
      role
    );

    try {
      const created = await this.usersService.addNewUser(newUser);
      return res.status(200).json(created);
    } catch (e) {
      console.error(e);
      return res.status(500).send("Something went wrong");
    }
  };

  static async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static async isPasswordMatches(password, hashToCompare) {
    return bcrypt.compare(password, hashToCompare);
  }

  static generateUUID() {
    return crypto.randomUUID();
  }
}

module.exports = { AuthController };
