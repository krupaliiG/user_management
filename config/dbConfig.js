// const mysql = require("mysql");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "test",
// });

// module.exports = db;

const dbConfig = {
  URL: "mongodb://localhost:27017/userDB",
};

module.exports = dbConfig;
