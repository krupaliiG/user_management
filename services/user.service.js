import { userModel } from "../models";
import { ObjectId } from "mongodb";

const findOneQuery = async (body) => {
  const data = await userModel.findOne(body);
  return data;
};

const insertOne = async (body) => {
  const data = new userModel(body);
  const savedData = await data.save();
  return savedData;
};

const userFindoneUpdateQuery = async (filter, update) => {
  let options = { new: true };
  const user = await userModel.findOneAndUpdate(filter, update, options);
  return user;
};

const findAllQuery = async (Query) => {
  const data = await userModel.find(Query);
  return data;
};

const deleteOneQuery = async (id) => {
  const data = await userModel.findByIdAndDelete(id);
  return data;
};

export default {
  findOneQuery,
  insertOne,
  userFindoneUpdateQuery,
  findAllQuery,
  deleteOneQuery,
};
