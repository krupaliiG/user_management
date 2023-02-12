import express from "express";

import { INTERNAL_LINKS } from "../enum";
import { roleController } from "../controllers";
import { authentication } from "../middleware";
import { validationSchema } from "../joiSchema";

// ADD API as method GET => PUT => POST => DELETE
export default express
  .Router()
  .post(
    INTERNAL_LINKS.ROLE.ADD_ROLE,
    authentication,
    roleController.addUpdateRole
  )
  .get(INTERNAL_LINKS.ROLE.GET_ROLE, authentication, roleController.getAllRole)
  .delete(
    INTERNAL_LINKS.ROLE.DELETE_ROLE,
    authentication,
    roleController.deleteRole
  );
