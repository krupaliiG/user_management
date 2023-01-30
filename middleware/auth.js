import { verify } from "jsonwebtoken";
import { userService } from "../services";

const authentication = async (request, response, next) => {
  try {
    let jwtToken = null;
    const authHeader = request.headers["authorization"];

    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
      if (jwtToken === undefined) throw new Error("Invalid token!");

      const data = verify(jwtToken, "MY_SECRET_TOKEN");
      if (!data)
        response
          .status(401)
          .send({ success: false, message: "Invalid Credentials!" });

      const res = await userService.findByEmail(data.email);

      if (!res)
        throw new Error({ success: false, message: "Invalid Credentials!" });

      request.currentUser = res[0];
      next();
    } else {
      response
        .status(400)
        .send({ success: false, message: "Authorization should be there!" });
    }
  } catch (error) {
    response.status(401).send({ success: false, message: error.message });
  }
};

export default authentication;
