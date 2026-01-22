const Joi = require("joi");

const CreateStudentSchema = Joi.object({
  name: Joi.string().max(100).required(),
  age: Joi.number().integer().min(16).required(),
  group: Joi.number().integer().required(),
});

const UpdateStudentSchema = Joi.object({
  name: Joi.string().max(100),
  age: Joi.number().integer().min(16),
  group: Joi.number().integer(),
}).min(1); 

module.exports = {
  CreateStudentSchema,
  UpdateStudentSchema
};
