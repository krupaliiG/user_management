import express from "express";

import { INTERNAL_LINKS } from "../constant";
import { issueController } from "../controllers";
import { authentication } from "../middleware";
import { validationSchema } from "../joiSchema";

// ADD API as method GET => PUT => POST => DELETE
export default express
  .Router()
  .post(
    INTERNAL_LINKS.ISSUE.CREATE_ISSUE,
    authentication,
    validationSchema.createIssueSchema,
    issueController.addUpdateIssue
  )
  .get(
    INTERNAL_LINKS.ISSUE.GET_ISSUE,
    authentication,
    issueController.getAllIssues
  )
  .delete(
    INTERNAL_LINKS.ISSUE.DELETE_ISSUE,
    authentication,
    issueController.deleteIssue
  );
