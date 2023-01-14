const dbConfig = require("./config/dbConfig.js");
const mongoose = require("mongoose");
const express = require("express");
var bodyParser = require("body-parser");
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

mongoose.Promise = global.Promise;

mongoose
  .connect(dbConfig.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.log("Could not connect to the database. Exiting now...", error);
    process.exit(1);
  });

import { userRoute } from "./routes";
import { INTERNAL_LINKS } from "./constant";

app.use(INTERNAL_LINKS.USER.BASE_URL, userRoute);

app.listen(3000, () => {
  console.log("Server started at port 3000");
});
