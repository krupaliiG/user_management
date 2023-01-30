import { roleService } from "../services";
import { passwordOp } from "../utils";
import { sendMail, randomPass } from "../utils";

const addUpdateUser = async (request, response) => {
  try {
    const { id, emailid, username } = request.body;
    if (id) {
      const checkExistingUser = await roleService.findByEmail(emailid);
      if (!checkExistingUser) throw new Error(`User not exist.`);
      let filter = {
          emailid,
        },
        data = {
          ...request.body,
          updated_by: request.currentUser.id,
          updated_at: now(),
        };
      const updateUser = await roleService.findByEmailAndUpdate(filter, data);
      data &&
        response
          .status(200)
          .send({ success: true, message: "User updated successfuly!" });
    } else {
      const rows = await roleService.findByEmail(emailid);
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
        const data = await roleService.insertOne(obj);

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
    let data = await roleService.findAll(filterQuery);
    response.status(200).send({ success: true, data });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

const deleteUser = async (request, response) => {
  try {
    const { id } = request.query;
    if (!id) throw new Error("Please pass valid Id to delete!");

    const data = await roleService.deleteOne(id);
    response
      .status(200)
      .send({ success: true, message: "User deleted Successfullly!" });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

export default {
  addUpdateUser,
  getAllUsers,
  deleteUser,
};
