import {
  projectService,
  projectAssignService,
  projectHistoryService,
} from "../services";
import project_assignService from "../services/project_assign.service";

const addUpdateProject = async (request, response) => {
  try {
    const { id, projectname, status, team_id } = request.body;
    console.log("request.currentUser:::", request.currentUser);
    if (id) {
      const checkExistingProject = await projectService.findByName(projectname);
      if (checkExistingProject && checkExistingProject.length === 0)
        throw new Error(`Project does not exist.`);
      console.log("checkExistingProject:::", checkExistingProject);
      let filter = {
          id,
        },
        data = {
          ...request.body,
          updated_by: request.currentUser.id,
        };

      if (checkExistingProject[0].status !== status) {
        console.log("here::::");
        console.log("status::::", status);

        const obj = {
          project_id: checkExistingProject[0].id,
          user_id: request.currentUser.id,
          status,
        };
        const addProjectHistory = await projectHistoryService.insertOne(obj);
        console.log("addProjectHistory:::", addProjectHistory);
      }
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

        let project_id = data.insertId;

        if (data.affectedRows === 1 && data.insertId) {
          const obj = {
            project_id,
            user_id: request.currentUser.id,
            status,
          };
          const addProjectHistory = await projectHistoryService.insertOne(obj);
          console.log("addProjectHistory:::", addProjectHistory);
        }
        if (
          data.affectedRows === 1 &&
          data.insertId &&
          team_id &&
          team_id.length > 0
        ) {
          for (const id of team_id) {
            const obj = {
              project_id,
              user_id: id,
            };
            const data = await projectAssignService.insertOne(obj);
          }
        }

        data &&
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

const assignTeamToProject = async (request, response) => {
  try {
    const { project_id, team_id } = request.body;
    const checkExistingProject = await projectService.findById(project_id);
    if (checkExistingProject && checkExistingProject.length === 0)
      throw new Error(`Project does not exist.`);

    if (team_id && team_id.length > 0) {
      for (const id of team_id) {
        const obj = {
          project_id,
          user_id: id,
        };
        const data = await projectAssignService.insertOne(obj);
      }
    } else {
      throw new Error("Select At least one team member to assign to Project.");
    }

    response
      .status(200)
      .send({ success: true, message: "Team Assign to Project Successfully!" });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

const updateHour = async (request, response) => {
  try {
    const { project_id, hour, modal } = request.body;
    let filter = {
      project_id,
      modal,
      user_id: request.currentUser.id,
    };

    const checkExistingProject = await projectAssignService.findOne(filter);
    if (checkExistingProject && checkExistingProject.length === 0)
      throw new Error(`Project With currentUser Doen't exist!`);
    console.log("checkExistingProject:::", checkExistingProject);

    let update = {
      ...request.body,
      updated_by: request.currentUser.id,
    };

    const updateHours = await projectAssignService.findOneAndUpdate(
      filter,
      hour
    );

    updateHours.affectedRows === 1 &&
      response.status(200).send({
        success: true,
        message: "Hours updated for Project successfully!",
      });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

export default {
  addUpdateProject,
  getAllProjects,
  deleteProject,
  assignTeamToProject,
  updateHour,
};
