const pool = require("../config/dbConfig");

const findById = async (id) => {
  const [rows, fields] = await pool.query("select * from tasks where id = ?", [
    id,
  ]);
  return rows;
};

const insertOne = async (data) => {
  const { project_id, taskname, description, status, created_by } = data;
  const sql =
    "insert into tasks (project_id,taskname,description,status,created_by) values (?, ?,?, ?,?);";
  const [rows, fields] = await pool.query(sql, [
    project_id,
    taskname,
    description,
    status,
    created_by,
  ]);
  return rows;
};

const findByIdAndUpdate = async (filter, data) => {
  let { id } = filter;
  const { project_id, taskname, description, status, updated_by } = data;
  const sql = `update tasks set 
     ${project_id ? `project_id ='${project_id}',` : ""}
     ${taskname ? `taskname ='${taskname}',` : ""}
     ${description ? `description ='${description}',` : ""}
     ${status ? `status = '${status}',` : ""}
     ${updated_by ? `updated_by = '${updated_by}',` : ""}
     updated_at = NOW()
     where id =${id} ;`;
  const [rows, fields] = await pool.query(sql);
  return rows;
};

const findAll = async (Query) => {
  const { taskname, project_id, status } = Query;
  const sql = `select * from tasks where id is not null ${
    project_id ? `and project_id="${project_id}"` : ""
  } ${status ? `and status="${status}"` : ""} ${
    taskname ? `and taskname="${taskname}"` : ""
  }`;
  const [rows, fields] = await pool.query(sql);
  return rows;
};

const deleteOne = async (id) => {
  const sql = "DELETE FROM tasks WHERE id = ?;";
  const [rows, fields] = await pool.query(sql, [id]);
  return rows;
};

export default {
  insertOne,
  findById,
  findByIdAndUpdate,
  findAll,
  deleteOne,
};
