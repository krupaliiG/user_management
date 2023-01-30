const pool = require("../config/dbConfig");

const findByName = async (name) => {
  const [rows, fields] = await pool.query(
    "select * from projects where projectname = ?",
    [name]
  );
  return rows;
};

const findById = async (id) => {
  const [rows, fields] = await pool.query(
    "select * from projects where id = ?",
    [id]
  );
  return rows;
};

const insertOne = async (data) => {
  const {
    client_id,
    projectname,
    estimate_hours,
    actual_hour,
    billable_hour,
    status,
    created_by,
  } = data;
  const sql =
    "insert into projects (client_id,projectname,estimate_hours,actual_hour,billable_hour,status,created_by) values (?, ?,?, ?,?,?,?);";
  const [rows, fields] = await pool.query(sql, [
    client_id,
    projectname,
    estimate_hours,
    actual_hour,
    billable_hour,
    status,
    created_by,
  ]);
  return rows;
};

const findByIdAndUpdate = async (filter, data) => {
  let { id } = filter;
  const {
    client_id,
    projectname,
    estimate_hours,
    actual_hour,
    billable_hour,
    status,
    updated_by,
  } = data;
  const sql = `update projects set 
   ${client_id ? `client_id ='${client_id}',` : ""}
   ${projectname ? `projectname ='${projectname}',` : ""}
   ${estimate_hours ? `estimate_hours ='${estimate_hours}',` : ""}
   ${actual_hour ? `actual_hour = '${actual_hour}',` : ""} 
   ${billable_hour ? `billable_hour = '${billable_hour}',` : ""}
   ${status ? `status = '${status}',` : ""}
   updated_at = NOW()
   where id =${id} ;`;
  const [rows, fields] = await pool.query(sql);
  return rows;
};

const findAll = async (Query) => {
  const { projectname, status } = Query;
  const sql = `select * from projects where id is not null ${
    projectname ? `and projectname="${projectname}"` : ""
  } ${status ? `and status="${status}"` : ""}`;
  const [rows, fields] = await pool.query(sql);
  return rows;
};

const deleteOne = async (id) => {
  const sql = "DELETE FROM projects WHERE id = ?;";
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
