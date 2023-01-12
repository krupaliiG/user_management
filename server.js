const express = require("express");
const app = express();
const db = require("./config/dbConfig");

db.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected!");
});

app.listen(3000, () => {
  console.log("Server started at port 3000");
});
