import password from "../utils/password";

const pool = require("../config/dbConfig")

const findByEmail = async (email) => {
  const [rows, fields] = await pool.query("select * from user where email = ?", [email])
  return rows
};

const find = async (body) => {
  const { email, password } = body
  const [rows, fields] = await pool.query("select * from user where email = ? and password = ?", [email, password])
  return rows
}

const insertOne = async (data) => {
  const { username, email, password } = data;
  const sql = "insert into user (username, email,password) values (?, ?, ?);"
  const [rows, fields] = await pool.query(sql, [username, email, password])
  return rows;
};

const findByEmailAndUpdate = async (update) => {
  let { email, password } = update
  const sql = "UPDATE user SET password = ? WHERE email = ?;"
  const [rows, fields] = await pool.query(sql, [password, email])
  return rows;
};

const findAll = async (Query) => {
  const sql = `select * from user;`
  const [rows, fields] = await pool.query(sql)
  return rows;
};

const deleteOne = async (id) => {
  const sql = "DELETE FROM user WHERE id = ?;"
  const [rows, fields] = await pool.query(sql, [id])
  return rows;
};

export default {
  findByEmail,
  find,
  insertOne,
  findByEmailAndUpdate,
  findAll,
  deleteOne,
};
