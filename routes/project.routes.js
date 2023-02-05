import express from "express";

import { INTERNAL_LINKS } from "../enum";
import { projectController } from "../controllers";
import { authentication } from "../middleware";
import { validationSchema } from "../joiSchema";

// ADD API as method GET => PUT => POST => DELETE
export default express
  .Router()
  .post(
    INTERNAL_LINKS.PROJECT.CREATE_PROJECT,
    authentication,
    validationSchema.createProjectSchema,
    projectController.addUpdateProject
  )
  .get(
    INTERNAL_LINKS.PROJECT.GET_PROJECT,
    authentication,
    projectController.getAllProjects
  )
  .delete(
    INTERNAL_LINKS.PROJECT.DELETE_PROJECT,
    authentication,
    projectController.deleteProject
  )
  .post(
    INTERNAL_LINKS.PROJECT.ASSIGN_TEAM_TO_PROJECT,
    authentication,
    projectController.assignTeamToProject
  )
  .post(
    INTERNAL_LINKS.PROJECT.UPDATE_HOUR,
    authentication,
    projectController.updateProjectHour
  );
