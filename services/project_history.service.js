const pool = require("../config/dbConfig");

const insertOne = async (data) => {
  console.log("data in insertOne Query::", data);
  const { project_id, user_id, status } = data;
  const sql =
    "insert into project_history (project_id,user_id,status) values (?,?,?);";
  const [rows, fields] = await pool.query(sql, [project_id, user_id, status]);
  return rows;
};

export default {
  insertOne,
};
