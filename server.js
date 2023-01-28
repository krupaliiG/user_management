const mongoose = require("mongoose");
const express = require("express");
var bodyParser = require("body-parser");
require("dotenv").config({ path: ".env" });
const app = express();
import morgan from "morgan";

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 1000000,
  })
);

app.use(
  bodyParser.json({
    limit: "50mb",
    verify: function (req, res, buf) {
      var url = req.originalUrl;
      if (url.includes("/stripe-webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);

app.use(morgan("dev"));

import { userRoute, roleRoute } from "./routes";
import { INTERNAL_LINKS } from "./constant";

app.use(INTERNAL_LINKS.USER.BASE_URL, userRoute);
app.use(INTERNAL_LINKS.ROLE.BASE_URL, roleRoute);

app.listen(3000, () => {
  console.log("Server started at port 3000");
});
