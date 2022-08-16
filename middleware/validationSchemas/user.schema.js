/* eslint-disable no-useless-escape */
const Joi = require('joi');

const create = Joi.object({
  email: Joi
    .string()
    .trim()
    .required()
    .regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
    .message('Wrong email format!'),
  password: Joi
    .string()
    .trim()
    .required()
    .regex(/^(?=.*[A-Z])((?=.*[a-z]))(?=.*\d)(?=.*[\]\[}{,.<>~?_\-`'"+=\(\)!@#\$%\^&\*\\;:|\/])[A-Za-z\d\]\[}{,.<>~?_\-`'"+=\(\)!@#\$%\^&\*\\;:|\/]{8,}$/)
    .message('This password must contain 8 characters, one uppercase, one lowercase, one number and one special case character'),
});

const update = Joi.object({
  avatar: Joi.string().trim(),
  thumbnailImage: Joi.string().trim(),
  userName: Joi.string().trim(),
  fullName: Joi.string().trim(),
  description: Joi.string().trim(),
  address: Joi.string().trim(),
  phone: Joi.string().trim(),
});

module.exports = {
  create,
  update,
};
