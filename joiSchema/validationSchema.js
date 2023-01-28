import Joi, { func } from "joi";
import { validateRequest } from "../middleware";

function registerSchema(req, res, next) {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string().required(),
    emailid: Joi.string().required(),
    role_id: Joi.number().integer().required(),
    password: Joi.string().required(),
    company_name: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    zip: Joi.number().integer().required(),
  }).unknown(true);
  validateRequest(req, res, next, schema);
}

function createUserSchema(req, res, next) {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string().required(),
    emailid: Joi.string().required(),
    role_id: Joi.number().integer().required(),
    company_name: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    zip: Joi.number().integer().required(),
  }).unknown(true);
  validateRequest(req, res, next, schema);
}

function loginSchema(req, res, next) {
  const schema = Joi.object({
    emailid: Joi.string().required(),
    password: Joi.string().required(),
  }).unknown(true);
  validateRequest(req, res, next, schema);
}

function forgetPasswordSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().required(),
  });
  validateRequest(req, res, next, schema);
}

export default {
  registerSchema,
  createUserSchema,
  loginSchema,
  forgetPasswordSchema,
};