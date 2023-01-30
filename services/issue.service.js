const pool = require("../config/dbConfig");

const findByName = async (name) => {
  const [rows, fields] = await pool.query(
    "select * from projects where projectname = ?",
    [name]
  );
  return rows;
};

const findById = async (id) => {
  const [rows, fields] = await pool.query("select * from issues where id = ?", [
    id,
  ]);
  return rows;
};

const insertOne = async (data) => {
  const { task_id, issue, description, status, created_by } = data;
  const sql =
    "insert into issues (task_id,issue,description,status,created_by) values (?,?,?,?,?);";
  const [rows, fields] = await pool.query(sql, [
    task_id,
    issue,
    description,
    status,
    created_by,
  ]);
  return rows;
};

const findByIdAndUpdate = async (filter, data) => {
  let { id } = filter;
  const { task_id, issue, description, status, updated_by } = data;
  const sql = `update issues set 
   ${task_id ? `task_id ='${task_id}',` : ""}
   ${issue ? `issue ='${issue}',` : ""}
   ${description ? `description ='${description}',` : ""}
   ${status ? `status = '${status}',` : ""}
   updated_at = NOW()
   where id =${id} ;`;
  const [rows, fields] = await pool.query(sql);
  return rows;
};

const findAll = async (Query) => {
  const { issue, status } = Query;
  const sql = `select * from issue where id is not null ${
    issue ? `and issue="${issue}"` : ""
  } ${status ? `and status="${status}"` : ""}`;
  const [rows, fields] = await pool.query(sql);
  return rows;
};

const deleteOne = async (id) => {
  const sql = "DELETE FROM issues WHERE id = ?;";
  const [rows, fields] = await pool.query(sql, [id]);
  return rows;
};

export default {
  findByName,
  findById,
  insertOne,
  findByIdAndUpdate,
  findAll,
  deleteOne,
};
