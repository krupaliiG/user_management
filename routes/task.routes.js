import express from "express";

import { INTERNAL_LINKS } from "../enum";
import { taskController } from "../controllers";
import { authentication } from "../middleware";
import { validationSchema } from "../joiSchema";

// ADD API as method GET => PUT => POST => DELETE
export default express
  .Router()
  .post(
    INTERNAL_LINKS.TASK.CREATE_TASK,
    validationSchema.createTaskSchema,
    authentication,
    taskController.addUpdateTask
  )
  .get(INTERNAL_LINKS.TASK.GET_TASK, authentication, taskController.getAllTasks)
  .delete(
    INTERNAL_LINKS.TASK.DELETE_TASK,
    authentication,
    taskController.deleteTask
  )
  .post(
    INTERNAL_LINKS.TASK.ASSIGN_TEAM_TO_TASK,
    authentication,
    taskController.assignTeamToTask
  );
