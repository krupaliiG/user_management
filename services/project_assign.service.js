const pool = require("../config/dbConfig");

const insertOne = async (data) => {
  console.log("data in insertOne Query::", data);
  const { project_id, user_id } = data;
  const sql = "insert into project_assign (project_id,user_id) values (?,?);";
  const [rows, fields] = await pool.query(sql, [project_id, user_id]);
  return rows;
};

export default {
  insertOne,
};
