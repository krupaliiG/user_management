import { sign } from "jsonwebtoken";
import { passwordOp } from "../utils";
import { userService } from "../services";
import { userRoute } from "../routes";

const RegisterUser = async (request, response) => {
  try {
    const { username, email, password } = request.body;
    const rows = await userService.findByEmail(email)
    if (rows && rows.length) {
      response
        .status(400)
        .send({ success: false, message: "Email Already exists!" });
    } else {
      const hashedPassword = await passwordOp.hashPassword(password);
      const obj = {
        username,
        email,
        password: hashedPassword,
      }
      const data = await userService.insertOne(obj)
      data && response
        .status(200)
        .send({ success: true, message: "Registration Successfull!" });
    }

  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

const LoginUser = async (request, response) => {
  try {
    const { email, password } = request.body;
    const dbUser = await userService.findByEmail(email)
    if (!dbUser) {
      response.status(400).send({ success: false, message: "Invalid User" });
    } else {
      const isPasswordMatched = await passwordOp.comparePassword(
        password,
        dbUser[0].password
      );
      if (isPasswordMatched) {
        const data = await userService.find({
          email: email,
          password: dbUser[0].password,
        });
        if (data) {
          const payload = { email: email };
          const jwtToken = await sign(payload, "MY_SECRET_TOKEN");
          response.status(200).send({ success: true, message: "Login Successfully!", data: jwtToken });
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
    response.status(400).send({ success: false, message: error.message });
  }
};

const ChangePassword = async (request, response) => {
  try {
    const { email } = request.currentUser;
    const { oldPassword, newPassword } = request.body;
    let updatePassword;

    const dbUser = await userService.findByEmail(email);

    if (!dbUser) {
      response.status(400).send({ success: false, message: "Invalid User" });
    } else {
      const isPasswordMatched = await passwordOp.comparePassword(
        oldPassword,
        dbUser[0].password
      );

      if (!isPasswordMatched) throw new Error("Old Password is incorrect!");

      if (oldPassword === newPassword)
        throw new Error("You Can't Use Your Old password as new Password!");

      const hashed = await passwordOp.hashPassword(newPassword);
      const update = { email, password: hashed };

      updatePassword = await userService.findByEmailAndUpdate(update);
      if (!updatePassword) throw new Error("Error While Updating Password");
    }

    updatePassword &&
      response
        .status(200)
        .send({ success: true, message: "Password Updated Successfully" });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

const ListUser = async (request, response) => {
  try {
    let data = await userService.findAll();
    response.status(200).send({ success: true, data });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

const deleteUser = async (request, response) => {
  try {
    const { id } = request.query;
    if (!id) throw new Error("Please pass valid Id to delete!");

    const data = await userService.deleteOne(id);
    response
      .status(200)
      .send({ success: true, message: "User deleted Successfullly!" });
  } catch (error) {
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
