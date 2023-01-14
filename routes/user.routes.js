import express from "express";

import { INTERNAL_LINKS } from "../constant";
import { userController } from "../controllers";
import { authentication } from "../middleware";

// ADD API as method GET => PUT => POST => DELETE
export default express
  .Router()
  .post(INTERNAL_LINKS.USER.SIGNUP, userController.RegisterUser)
  .post(INTERNAL_LINKS.USER.LOGIN, userController.LoginUser)
  .post(
    INTERNAL_LINKS.USER.CHANGE_PASSWORD,
    authentication,
    userController.ChangePassword
  )
  .get(INTERNAL_LINKS.USER.USER_DETAIL, authentication, userController.ListUser)
  .delete(
    INTERNAL_LINKS.USER.DELETE_USERS,
    authentication,
    userController.deleteUser
  );
