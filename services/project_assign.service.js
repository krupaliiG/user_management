const pool = require("../config/dbConfig");
import { Constants } from "../enum";

const insertOne = async (data) => {
  console.log("data in insertOne Query::", data);
  const { project_id, user_id } = data;
  const sql = "insert into project_assign (project_id,user_id) values (?,?);";
  const [rows, fields] = await pool.query(sql, [project_id, user_id]);
  return rows;
};

const findOne = async (Query) => {
  const { project_id, user_id } = Query;
  const sql = `select * from project_assign where id is not null ${
    project_id ? `and project_id="${project_id}"` : ""
  } ${user_id ? `and user_id="${user_id}"` : ""}`;
  const [rows, fields] = await pool.query(sql);
  return rows;
};

const findOneAndUpdate = async (filter, hour) => {
  const { project_id, user_id } = filter;
  const sql = `UPDATE project_assign SET hour = ? WHERE project_id = ? and user_id = ?;`;
  const [rows, fields] = await pool.query(sql, [hour, project_id, user_id]);
  return rows;
};

export default {
  insertOne,
  findOne,
  findOneAndUpdate,
};
