import express from "express";

import { INTERNAL_LINKS } from "../constant";
import { userController } from "../controllers";
import { authentication } from "../middleware";

// ADD API as method GET => PUT => POST => DELETE
export default express
  .Router()
  .post(INTERNAL_LINKS.USER.SIGNUP, authentication, userController.RegisterUser)
  .post(INTERNAL_LINKS.USER.LOGIN, authentication, userController.LoginUser);
