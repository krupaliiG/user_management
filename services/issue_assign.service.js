const pool = require("../config/dbConfig");

const insertOne = async (data) => {
  console.log("data in insertOne Query::", data);
  const { issue_id, user_id } = data;
  const sql = "insert into issue_assign (issue_id,user_id) values (?,?);";
  const [rows, fields] = await pool.query(sql, [issue_id, user_id]);
  return rows;
};

export default {
  insertOne,
};
