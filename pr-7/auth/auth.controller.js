const bcrypt = require("bcrypt");
const crypto = require("crypto");
const logger = require("../logger/winston.logger");

const { UsersService } = require("../services/users.service");
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

    logger.info("Login attempt", { email: value.email });

    const user = await this.usersService.getUserByEmail(value.email);
    if (!user) {
      logger.warn("Login failed: user not found", { email: value.email });
      return res.status(401).send("User with such email was not found");
    }

    const ok = await AuthController.isPasswordMatches(
      value.password,
      user.passwordHash
    );

    if (!ok) {
      logger.warn("Login failed: invalid password", { email: value.email });
      return res.status(403).send("Wrong password or email");
    }

    const token = JWT.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    logger.info("Login successful", { userId: user.id, role: user.role });

    return res.status(200).json({
      accessToken: `Bearer ${token}`,
    });
  };

  registration = async (req, res) => {
    const { error, value } = UserRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details.map((i) => i.message));
    }

    logger.info("Registration attempt", { email: value.email });

    const existing = await this.usersService.getUserByEmail(value.email);
    if (existing) {
      logger.warn("Registration failed: user exists", { email: value.email });
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
      logger.info("User registered", { userId: created.id, role: created.role });
      return res.status(200).json(created);
    } catch (e) {
      logger.error("Registration error", { error: e.message });
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
