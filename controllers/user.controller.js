import { hashPassword } from "../utils";

const RegisterUser = async (request, response) => {
  try {
    const {
      body: { username, email, password, phone },
    } = request.body;

    const validateEmail = await userService.findOneQuery(email);

    if (validateEmail.length) {
      response
        .status(400)
        .send({ success: false, message: "Email Already exists!" });
    } else {
      const hashedPassword = await hashPassword(password);

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
    errorLogger(error.message || error, request.originalUrl);
    response.status(400).send({ success: false, message: error.message });
  }
};

const LoginUser = async (request, response) => {
  try {
    const { email, password } = request.body;
    const dbUser = await userModel.findOne({ email: email });

    if (!dbUser) {
      response.status(400).send({ success: false, message: "Invalid User" });
    } else {
      const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
      if (isPasswordMatched) {
        const data = await userModel.findOne({
          email: email,
          password: dbUser.password,
        });
        if (data) {
          const payload = { id: data._id, email: email };
          const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
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
    errorLogger(error.message || error, request.originalUrl);
    response.status(400).send({ success: false, message: error.message });
  }
};

const ChangePassword = async (request, response) => {
  try {
    const { _id } = request.currentUser;

    const updatedData = request.body;

    const data = await userModel.findByIdAndUpdate(_id, updatedData);
    response
      .status(200)
      .send({ success: true, message: "Password changed successfully!" });
  } catch (error) {
    errorLogger(error.message || error, request.originalUrl);
    response.status(400).send({ success: false, message: error.message });
  }
};

const ListUser = async (request, response) => {
  try {
    infoLogger(request.query, request.originalUrl);
    const {
      id = null,
      name = "",
      email = "",
      page = 0,
      limit = 0,
    } = request.query;

    let filterQuery = [];

    if (id) {
      filterQuery.push({ _id: id });
    }
    if (name) {
      filterQuery.push({ name: name });
    }
    if (email) {
      filterQuery.push({ email: email });
    }

    filterQuery = filterQuery.length ? { $or: filterQuery } : {};

    const data = await consentModel
      .find(filterQuery)
      .skip(page * limit)
      .limit(limit);

    response.status(200).send({ success: true, data: data });
  } catch (error) {
    errorLogger(error.message || error, request.originalUrl);
    response.status(400).send({ success: false, message: error.message });
  }
};

const deleteUser = async (request, response) => {
  try {
    const id = request.params;

    if (!id) {
      console.log("id is not available!");
    } else {
      console.log(id);
    }
    const data = await consentModel.findByIdAndDelete(ObjectId(id));
    response
      .status(200)
      .send({ success: true, message: "User deleted Successfullly!" });
  } catch (error) {
    errorLogger(error.message || error, request.originalUrl);
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
