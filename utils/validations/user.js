import Joi from "joi";

export const signUpSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
});
