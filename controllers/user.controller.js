import { sign } from "jsonwebtoken";
import { passwordOp, sendMail, randomPass } from "../utils";
import { userService } from "../services";
import { userRoute } from "../routes";
import { v4 as uuidv4 } from "uuid";

const RegisterUser = async (request, response) => {
  try {
    const { emailid, username, password } = request.body;
    const rows = await userService.findByEmail(emailid);
    if (rows && rows.length) {
      response
        .status(400)
        .send({ success: false, message: "Email Already exists!" });
    } else {
      const hashedPassword = await passwordOp.hashPassword(password);
      const obj = { ...request.body, password: hashedPassword };
      const data = await userService.insertOne(obj);

      let subject = "Welcome On Board!";
      let html = `<p>Welcome <strong>${username}</strong></p></br>
      <p>Your Password Is:<strong>${password}</strong></p>`;
      sendMail(emailid, subject, html);

      data &&
        response
          .status(200)
          .send({ success: true, message: "Registration Successfull!" });
    }
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

const LoginUser = async (request, response) => {
  try {
    const { emailid, password } = request.body;
    const dbUser = await userService.findByEmail(emailid);
    if (!dbUser || dbUser.length == 0) {
      response.status(400).send({ success: false, message: "Invalid User" });
    } else {
      const isPasswordMatched = await passwordOp.comparePassword(
        password,
        dbUser[0].password
      );
      if (isPasswordMatched) {
        const data = await userService.find({
          email: emailid,
          password: dbUser[0].password,
        });
        if (data) {
          const payload = { email: emailid };
          const jwtToken = await sign(payload, "MY_SECRET_TOKEN");
          response.status(200).send({
            success: true,
            message: "Login Successfully!",
            data: jwtToken,
          });
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
    const { emailid } = request.currentUser;
    const { oldPassword, newPassword } = request.body;
    let updatePassword;

    const dbUser = await userService.findByEmail(emailid);

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
      const update = { emailid, password: hashed };

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

const forgetPassword = async (request, response) => {
  try {
    console.log(request.body);
    const { emailid } = request.body;
    let token;
    const dbUser = await userService.findByEmail(emailid);
    console.log("dbUser:::", dbUser);
    if (!dbUser || dbUser.length == 0) {
      response.status(400).send({
        success: false,
        message: "This User doesn't exists! In stead try Registering.",
      });
    }
    if (dbUser[0].resettoken != null && dbUser[0].resettoken != "") {
      token = dbUser[0].resettoken;
    } else {
      token = uuidv4();
    }
    let update = {
        token,
      },
      filter = {
        emailid,
      };

    const data = await userService.findByEmailAndUpdate(filter, update);
    const link = `${process.env.BASE_URL}/password-reset/${dbUser[0].id}/${token}`;
    let html = `<p><b>Password reset link: </b></p></br>
            <p>Please use below link to reset your password.</p></br>
            <p>${link}</p>`;
    await sendMail(dbUser[0].emailid, "Password reset", html);

    response.status(200).send({
      success: true,
      message: "Password reset link sent to your email account!",
    });
  } catch (error) {
    console.log("error:::", error);
    response.status(400).send({ success: false, message: error.message });
  }
};

const addUpdateUser = async (request, response) => {
  try {
    const { id, emailid, username } = request.body;
    if (id) {
      const checkExistingUser = await userService.findByEmail(emailid);
      if (!checkExistingUser) throw new Error(`User not exist.`);
      let filter = {
          emailid,
        },
        data = {
          ...request.body,
          updated_by: request.currentUser.id,
        };
      const updateUser = await userService.findByEmailAndUpdate(filter, data);
      updateUser &&
        updateUser.affectedRows === 1 &&
        response
          .status(200)
          .send({ success: true, message: "User updated successfuly!" });
    } else {
      const rows = await userService.findByEmail(emailid);
      if (rows && rows.length) {
        response.status(400).send({
          success: false,
          message:
            "Email Already exists!Please use another email to create user!",
        });
      } else {
        const password = randomPass[0];
        const hashedPassword = await passwordOp.hashPassword(password);
        const obj = {
          ...request.body,
          password: hashedPassword,
          created_by: request.currentUser.id,
          updated_by: request.currentUser.id,
        };
        const data = await userService.insertOne(obj);

        let subject = "Welcome On Board!";
        let html = `<p><b>Login Details: </b></p></br>
            <p>Welcome <strong>${username}</strong></p></br>
            <p>Your Password Is:<strong>${password}</strong></p>`;
        sendMail(emailid, subject, html);

        data &&
          response
            .status(200)
            .send({ success: true, message: "User created successfuly!" });
      }
    }
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

const getAllUsers = async (request, response) => {
  try {
    let { id, username, email } = request.query;
    let filterQuery = {
      id,
      username,
      email,
    };
    let data = await userService.findAll(filterQuery);
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
  forgetPassword,
  addUpdateUser,
  getAllUsers,
  deleteUser,
};
