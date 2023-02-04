const pool = require("../config/dbConfig");

const insertOne = async (data) => {
  console.log("data in insertOne Query::", data);
  const { task_id, user_id } = data;
  const sql = "insert into task_assign (task_id,user_id) values (?,?);";
  const [rows, fields] = await pool.query(sql, [task_id, user_id]);
  return rows;
};

export default {
  insertOne,
};
