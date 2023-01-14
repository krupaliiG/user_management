import { Schema, model, Types } from "mongoose";
const ObjectID = require("mongodb");

const userSchema = new Schema(
  {
    username: { type: String },
    email: { type: String },
    password: { type: String },
    phone: { type: String },
  },
  { timestamps: true, versionKey: false }
);

const User = new model("User", userSchema);

export default User;
