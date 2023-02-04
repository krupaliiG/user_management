const pool = require("../config/dbConfig");

const insertOne = async (data) => {
  console.log("data in insertOne Query::", data);
  const { issue_id, user_id, status } = data;
  const sql =
    "insert into issue_history (issue_id,user_id,status) values (?,?,?);";
  const [rows, fields] = await pool.query(sql, [issue_id, user_id, status]);
  return rows;
};

export default {
  insertOne,
};
