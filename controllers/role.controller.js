import { roleService } from "../services";

const addUpdateRole = async (request, response) => {
  try {
    console.log("req.body:::", request.body);
    const { id, name } = request.body;
    if (id) {
      const checkExistingRole = await roleService.findById(id);
      if (checkExistingRole && checkExistingRole.length === 0)
        throw new Error(`Role does not exist.`);

      let filter = {
          id,
        },
        data = {
          ...request.body,
        };

      const updateProject = await roleService.findByIdAndUpdate(filter, data);
      console.log("updateProject:::", updateProject);
      updateProject &&
        response
          .status(200)
          .send({ success: true, message: "Role Updated Successfully!" });
    } else {
      const rows = await roleService.findByName(name);
      if (rows && rows.length) {
        response.status(400).send({
          success: false,
          message: "Role Already exists!Please use another Role!",
        });
      } else {
        const obj = {
          ...request.body,
        };
        const data = await roleService.insertOne(obj);
        console.log("data in role:::", data);

        data &&
          data.affectedRows === 1 &&
          response
            .status(200)
            .send({ success: true, message: "New Role Added Successfully!" });
      }
    }
  } catch (error) {
    console.log("error:::", error);
    response.status(400).send({ success: false, message: error.message });
  }
};

const getAllRole = async (request, response) => {
  try {
    let { name, status } = request.query;
    let filterQuery = {
      name,
      status,
    };
    let data = await roleService.findAll(filterQuery);
    response.status(200).send({ success: true, data });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

const deleteRole = async (request, response) => {
  try {
    const { id } = request.query;
    if (!id) throw new Error("Please pass valid Id to delete!");

    const data = await roleService.deleteOne(id);
    response
      .status(200)
      .send({ success: true, message: "Role deleted Successfully!" });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

export default { addUpdateRole, getAllRole, deleteRole };
