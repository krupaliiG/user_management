import password from "../utils/password";
import { Constants } from "../enum";

const pool = require("../config/dbConfig");

const findByEmail = async (emailid) => {
  const [rows, fields] = await pool.query(
    "select * from user where emailid = ?",
    [emailid]
  );
  console.log("rows::", rows);
  return rows;
};

const find = async (body) => {
  const { emailid, password } = body;
  const [rows, fields] = await pool.query(
    "select * from user where emailid = ? and password = ?",
    [emailid, password]
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

const findByEmailAndUpdate = async (filter, update) => {
  console.log("update:::", update);
  console.log("filter:::", filter);

  console.log(Object.keys(update).length);

  let sql = "UPDATE user SET ";
  const updateFields = Object.keys(update),
    filterFields = Object.keys(filter);

  console.log("updateFields:::", updateFields);
  console.log("filterFields:::", filterFields);

  let datatoSend = [],
    i = 0;
  for (const key of updateFields) {
    i += 1;
    sql += `${Constants.user_keys[key]} = ? `;
    if (i < Object.keys(update).length) {
      sql += `,`;
    }
    // console.log("key:::", key);
    datatoSend.push(update[key]);
  }
  sql += filterFields.length ? " WHERE " : "";
  for (const key of filterFields) {
    sql += `${Constants.user_keys[key]} = ? `;
    datatoSend.push(filter[key]);
  }
  console.log("sql,", sql, datatoSend);
  const [rows, fields] = await pool.query(sql, datatoSend);
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
  findAll,
  deleteOne,
};
