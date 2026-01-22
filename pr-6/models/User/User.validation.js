const Joi = require("joi");
const { UserRole } = require("../enums/UserRole.enum");

const UserRegistrationSchema = Joi.object({
  name: Joi.string().max(100).required(),
  surname: Joi.string().max(100).required(),
  email: Joi.string().email().max(150).required(),
  password: Joi.string().min(6).max(200).required(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .optional(),
});

const UserLoginSchema = Joi.object({
  email: Joi.string().email().max(150).required(),
  password: Joi.string().min(6).max(200).required(),
});

module.exports = { UserRegistrationSchema, UserLoginSchema };
