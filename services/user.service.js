import password from "../utils/password";

const pool = require("../config/dbConfig");

const findByEmail = async (email) => {
  const [rows, fields] = await pool.query(
    "select * from user where emailid = ?",
    [email]
  );
  return rows;
};

const find = async (body) => {
  const { email, password } = body;
  const [rows, fields] = await pool.query(
    "select * from user where emailid = ? and password = ?",
    [email, password]
  );
  return rows;
};

const insertOne = async (data) => {
  const {
    first_name,
    last_name,
    username,
    emailid,
    password,
    role_id,
    company_name,
    phone,
    address,
    city,
    state,
    country,
    zip,
  } = data;
  const sql =
    "insert into user (first_name,last_name,username,emailid,password,role_id,company_name,phone,address,city,state,country,zip) values (?,?,?,?,?,?,?,?,?,?,?,?,?);";
  const [rows, fields] = await pool.query(sql, [
    first_name,
    last_name,
    username,
    emailid,
    password,
    role_id,
    company_name,
    phone,
    address,
    city,
    state,
    country,
    zip,
  ]);
  return rows;
};

const findByEmailAndUpdate = async (update) => {
  let { email, password } = update;
  const sql = "UPDATE user SET password = ? WHERE emailid = ?;";
  const [rows, fields] = await pool.query(sql, [password, email]);
  return rows;
};

const findByEmailAndUpdateToken = async (update) => {
  let { emailid, token } = update;
  const sql = "UPDATE user SET resettoken = ? WHERE emailid = ?;";
  const [rows, fields] = await pool.query(sql, [token, emailid]);
  return rows;
};

const findAll = async (Query) => {
  const { id, username, email } = Query;
  const sql = `select * from user where id is not null ${
    username ? `and username=${username}` : ""
  } ${email ? `and email=${email}` : ""} ${id ? ` and id=${id}` : ""};`;
  const [rows, fields] = await pool.query(sql);
  return rows;
};

const deleteOne = async (id) => {
  const sql = "DELETE FROM user WHERE id = ?;";
  const [rows, fields] = await pool.query(sql, [id]);
  return rows;
};

export default {
  findByEmail,
  find,
  insertOne,
  findByEmailAndUpdate,
  findByEmailAndUpdateToken,
  findAll,
  deleteOne,
};
