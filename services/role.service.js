const pool = require("../config/dbConfig");

const findByName = async (name) => {
  const [rows, fields] = await pool.query("select * from role where name = ?", [
    name,
  ]);
  return rows;
};

const findById = async (id) => {
  const [rows, fields] = await pool.query("select * from role where id = ?", [
    id,
  ]);
  return rows;
};

const findByIdAndUpdate = async (filter, data) => {
  let { id } = filter;
  console.log("data:::", data);
  const { name, status } = data;
  const sql = `update role set 
  ${name ? `name = '${name}',` : ""}
  ${status ? `status = '${status}',` : ""}
  updated_at = NOW()
  where id =${id} ;`;
  console.log("sql:::", sql);
  const [rows, fields] = await pool.query(sql, [name, status]);
  return rows;
};

const findAll = async (Query) => {
  const { id, name, status } = Query;
  const sql = `select * from role where id is not null ${
    name ? `and name="${name}"` : ""
  } ${status ? `and status="${status}"` : ""} ${id ? ` and id=${id}` : ""};`;
  const [rows] = await pool.query(sql);
  return rows;
};

const insertOne = async (data) => {
  const { name, status } = data;
  const sql = "insert into role (name,status) values (?,?);";
  const [rows, fields] = await pool.query(sql, [name, status]);
  return rows;
};

const deleteOne = async (id) => {
  const sql = "DELETE FROM role WHERE id = ?;";
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
