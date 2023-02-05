const pool = require("../config/dbConfig");

const insertOne = async (data) => {
  console.log("data in insertOne Query::", data);
  const { task_id, user_id } = data;
  const sql = "insert into task_assign (task_id,user_id) values (?,?);";
  const [rows, fields] = await pool.query(sql, [task_id, user_id]);
  return rows;
};

const findOne = async (Query) => {
  const { task_id, user_id } = Query;
  const sql = `select * from task_assign where id is not null ${
    task_id ? `and task_id="${task_id}"` : ""
  } ${user_id ? `and user_id="${user_id}"` : ""}`;
  const [rows, fields] = await pool.query(sql);
  return rows;
};

const findOneAndUpdate = async (filter, hour) => {
  const { task_id, user_id } = filter;
  const sql = `UPDATE task_assign SET hour = ? WHERE task_id = ? and user_id = ?;`;
  const [rows, fields] = await pool.query(sql, [hour, task_id, user_id]);
  return rows;
};

export default {
  insertOne,
  findOne,
  findOneAndUpdate,
};
