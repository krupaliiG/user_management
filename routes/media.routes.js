import express from "express";

import { INTERNAL_LINKS } from "../enum";
import { mediaController } from "../controllers";
import { authentication, multerConfig } from "../middleware";

// ADD API as method GET => PUT => POST => DELETE
export default express
  .Router()
  .post(
    INTERNAL_LINKS.MEDIA.POST_MEDIA,
    multerConfig.upload.single("photo"),
    authentication,
    mediaController.postMedia
  );
