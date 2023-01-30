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
  const { emailid, password } = body;
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
    created_by,
    updated_by,
  } = data;
  const sql =
    "insert into user (first_name,last_name,username,emailid,password,role_id,company_name,phone,address,city,state,country,zip,created_by,updated_by) values (?, ?,?, ?,?,?,?,?,?,?,?,?,?,?,?);";
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
    created_by,
    updated_by,
  ]);
  return rows;
};

const findByEmailAndUpdate = async (filter, data) => {
  let { emailid } = filter;
  const {
    id,
    first_name,
    last_name,
    username,
    password,
    role_id,
    company_name,
    phone,
    address,
    city,
    state,
    country,
    zip,
    updated_by,
  } = data;
  const sql = `update user set 
   ${first_name ? `first_name ='${first_name}',` : ""}
   ${last_name ? `last_name ='${last_name}',` : ""}
   ${username ? `username ='${username}',` : ""}
   ${password ? `password = '${password}',` : ""} 
   ${role_id ? `role_id = '${role_id}',` : ""}
   ${company_name ? `company_name = '${company_name}',` : ""}
   ${phone ? `phone = '${phone}',` : ""}
   ${address ? `address = '${address}',` : ""}
   ${city ? `city = '${city}',` : ""}
   ${state ? `state = '${state}',` : ""}
   ${country ? `country = '${state}',` : ""}
   ${zip ? `zip = '${zip}'` : ""}
   updated_at = NOW()
   where id =${id} ;`;
  const [rows, fields] = await pool.query(sql);
  return rows;
};

const findAll = async (Query) => {
  const { id, username, email } = Query;
  const sql = `select * from user where id is not null ${
    username ? `and username="${username}"` : ""
  } ${email ? `and emailid="${email}"` : ""} ${id ? ` and id=${id}` : ""};`;
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
  findAll,
  deleteOne,
};
