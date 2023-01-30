import { projectService } from "../services";

const addUpdateProject = async (request, response) => {
  try {
    const { id, projectname } = request.body;
    if (id) {
      const checkExistingProject = await projectService.findByName(projectname);
      if (checkExistingProject && checkExistingProject.length === 0)
        throw new Error(`Project does not exist.`);
      let filter = {
          id,
        },
        data = {
          ...request.body,
          updated_by: request.currentUser.id,
        };
      const updateProject = await projectService.findByIdAndUpdate(
        filter,
        data
      );
      updateProject &&
        response
          .status(200)
          .send({ success: true, message: "Project updated successfully!" });
    } else {
      const rows = await projectService.findByName(projectname);
      if (rows && rows.length) {
        response.status(400).send({
          success: false,
          message:
            "Project name Already exists!Please use another name to create Project!",
        });
      } else {
        const obj = {
          ...request.body,
          created_by: request.currentUser.id,
        };
        const data = await projectService.insertOne(obj);

        response
          .status(200)
          .send({ success: true, message: "Project created successfully!" });
      }
    }
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

const getAllProjects = async (request, response) => {
  try {
    let { projectname, status } = request.query;
    let filterQuery = {
      projectname,
      status,
    };
    let data = await projectService.findAll(filterQuery);
    response.status(200).send({ success: true, data });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

const deleteProject = async (request, response) => {
  try {
    const { id } = request.query;
    if (!id) throw new Error("Please pass valid Id to delete!");

    const data = await projectService.deleteOne(id);
    response
      .status(200)
      .send({ success: true, message: "Project deleted Successfully!" });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

export default {
  addUpdateProject,
  getAllProjects,
  deleteProject,
};
