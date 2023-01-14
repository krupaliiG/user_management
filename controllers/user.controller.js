import { sign } from "jsonwebtoken";
import { passwordOp } from "../utils";
import { userService } from "../services";
import { userRoute } from "../routes";

const RegisterUser = async (request, response) => {
  try {
    const { username, email, password, phone } = request.body;

    const validateEmail = await userService.findOneQuery({ email });

    if (validateEmail !== null && validateEmail.length) {
      response
        .status(400)
        .send({ success: false, message: "Email Already exists!" });
    } else {
      const hashedPassword = await passwordOp.hashPassword(password);

      const obj = {
        username,
        email,
        password: hashedPassword,
      };

      const data = await userService.insertOne(obj);
      response
        .status(200)
        .send({ success: true, message: "Registration Successfull!" });
    }
  } catch (error) {
    console.log("error:::", error);
    // errorLogger(error.message || error, request.originalUrl);
    response.status(400).send({ success: false, message: error.message });
  }
};

const LoginUser = async (request, response) => {
  try {
    const { email, password } = request.body;
    const dbUser = await userService.findOneQuery({ email: email });

    if (!dbUser) {
      response.status(400).send({ success: false, message: "Invalid User" });
    } else {
      const isPasswordMatched = await passwordOp.comparePassword(
        password,
        dbUser.password
      );
      if (isPasswordMatched) {
        const data = await userService.findOneQuery({
          email: email,
          password: dbUser.password,
        });
        if (data) {
          const payload = { _id: data._id, email: email };
          const jwtToken = await sign(payload, "MY_SECRET_TOKEN");
          response.status(200).send({ success: true, message: jwtToken });
        } else {
          response
            .status(400)
            .send({ success: false, message: "Invalid Credentials!" });
        }
      } else {
        response
          .status(400)
          .send({ success: false, message: "Invalid Password!" });
      }
    }
  } catch (error) {
    console.log("error::", error);
    // errorLogger(error.message || error, request.originalUrl);
    response.status(400).send({ success: false, message: error.message });
  }
};

const ChangePassword = async (request, response) => {
  try {
    const { currentUser, body } = request;
    const { email, oldPassword, newPassword } = body;
    let updatePassword;

    const dbUser = await userService.findOneQuery({ email: email });

    if (!dbUser) {
      response.status(400).send({ success: false, message: "Invalid User" });
    } else {
      const isPasswordMatched = await passwordOp.comparePassword(
        oldPassword,
        dbUser.password
      );

      if (!isPasswordMatched) throw new Error("Old Password is incorrect!");

      if (oldPassword === newPassword)
        throw new Error("You Can't Use Your Previous Password");

      const hashed = await passwordOp.hashPassword(newPassword);
      const filter = { _id: currentUser._id };
      const update = { password: hashed };

      updatePassword = await userService.userFindoneUpdateQuery(filter, update);
      if (!updatePassword) throw new Error("Error While Updating Password");
    }

    updatePassword &&
      response
        .status(200)
        .send({ success: true, message: "Password Updated Successfully" });
  } catch (error) {
    // errorLogger(error.message, req.originalUrl);
    console.log("error:::", error);
    response.status(400).send({ success: false, message: error.message });
  }
};

const ListUser = async (request, response) => {
  try {
    // infoLogger(request.query, request.originalUrl);
    const { id = null, username = "", email = "" } = request.query;

    let filterQuery = [];

    if (id) {
      filterQuery.push({ _id: id });
    }
    if (username) {
      filterQuery.push({ username: username });
    }
    if (email) {
      filterQuery.push({ email: email });
    }

    filterQuery = filterQuery.length ? { $or: filterQuery } : {};

    let data = await userService.findAllQuery(filterQuery);

    response.status(200).send({ success: true, data: data });
  } catch (error) {
    // errorLogger(error.message || error, request.originalUrl);
    console.log("error:::", error);
    response.status(400).send({ success: false, message: error.message });
  }
};

const deleteUser = async (request, response) => {
  try {
    const { id } = request.query;
    if (!id) throw new Error("Please pass valid Id to delete!");

    const data = await userService.deleteOneQuery(id);
    response
      .status(200)
      .send({ success: true, message: "User deleted Successfullly!" });
  } catch (error) {
    // errorLogger(error.message || error, request.originalUrl);
    console.log("error::", error);
    response.status(400).send({ success: false, message: error.message });
  }
};

export default {
  RegisterUser,
  LoginUser,
  ChangePassword,
  ListUser,
  deleteUser,
};
