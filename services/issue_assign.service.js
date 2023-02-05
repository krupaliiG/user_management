const pool = require("../config/dbConfig");

const insertOne = async (data) => {
  console.log("data in insertOne Query::", data);
  const { issue_id, user_id } = data;
  const sql = "insert into issue_assign (issue_id,user_id) values (?,?);";
  const [rows, fields] = await pool.query(sql, [issue_id, user_id]);
  return rows;
};

const findOne = async (Query) => {
  const { issue_id, user_id } = Query;
  const sql = `select * from issue_assign where id is not null ${
    issue_id ? `and issue_id="${issue_id}"` : ""
  } ${user_id ? `and user_id="${user_id}"` : ""}`;
  const [rows, fields] = await pool.query(sql);
  return rows;
};

const findOneAndUpdate = async (filter, hour) => {
  const { issue_id, user_id } = filter;
  const sql = `UPDATE issue_assign SET hour = ? WHERE issue_id = ? and user_id = ?;`;
  const [rows, fields] = await pool.query(sql, [hour, issue_id, user_id]);
  return rows;
};

export default {
  insertOne,
  findOne,
  findOneAndUpdate,
};
