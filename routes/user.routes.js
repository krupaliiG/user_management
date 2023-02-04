import express from "express";

import { INTERNAL_LINKS } from "../enum";
import { userController } from "../controllers";
import { authentication } from "../middleware";
import { validationSchema } from "../joiSchema";

// ADD API as method GET => PUT => POST => DELETE
export default express
  .Router()
  .post(
    INTERNAL_LINKS.USER.SIGNUP,
    validationSchema.registerSchema,
    userController.RegisterUser
  )
  .post(
    INTERNAL_LINKS.USER.LOGIN,
    validationSchema.loginSchema,
    userController.LoginUser
  )
  .post(
    INTERNAL_LINKS.USER.CHANGE_PASSWORD,
    authentication,
    userController.ChangePassword
  )
  .post(
    INTERNAL_LINKS.USER.FORGET_PASSWORD,
    validationSchema.forgetPasswordSchema,
    userController.forgetPassword
  );
