import express from "express";

import { INTERNAL_LINKS } from "../enum";
import { roleController } from "../controllers";
import { authentication } from "../middleware";
import { validationSchema } from "../joiSchema";

// ADD API as method GET => PUT => POST => DELETE
export default express
  .Router()
  .post(
    INTERNAL_LINKS.ROLE.CREATE_USER,
    authentication,
    validationSchema.createUserSchema,
    roleController.addUpdateUser
  )
  .get(INTERNAL_LINKS.ROLE.GET_USER, authentication, roleController.getAllUsers)
  .delete(
    INTERNAL_LINKS.ROLE.DELETE_USER,
    authentication,
    roleController.deleteUser
  );
