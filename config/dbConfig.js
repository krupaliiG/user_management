const mysql = require('mysql2');

// // const db = mysql.createConnection({
// //   host: "localhost",
// //   user: "root",
// //   password: "root",
// //   database: "test",
// // });

// // module.exports = db;

// const dbConfig = {
//   URL: "mongodb://localhost:27017/userDB",
// };

// const dbConfig = async () => {
//   return await mysql.createConnection({
//     
//   })
// }

// module.exports = dbConfig;


const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root@123",
  database: "userDB",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, conn) => {
  if (err) console.log(err)
  console.log("Connected successfully")
})

module.exports = pool.promise()

