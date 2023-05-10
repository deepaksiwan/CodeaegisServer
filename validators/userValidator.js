const Joi = require("joi");
const usersignupSchema = Joi.object()
  .keys({
    user_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().max(5),
  })
  .required();
  const userloginSchema = Joi.object()
  .keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().max(5),
  })
  .required();
  module.exports = {
  usersignupSchema,
  userloginSchema
};