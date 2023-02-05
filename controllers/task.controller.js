import {
  taskService,
  projectService,
  taskAssignService,
  taskHistoryService,
} from "../services";

const addUpdateTask = async (request, response) => {
  try {
    const { id, project_id, team_id, status } = request.body;
    console.log("team_id:::", team_id);
    if (id) {
      const checkExistingTask = await taskService.findById(id);
      if (checkExistingTask && checkExistingTask.length === 0)
        throw new Error(`Task does not exist.`);

      let filter = {
          id,
        },
        data = {
          ...request.body,
          updated_by: request.currentUser.id,
        };

      if (checkExistingTask[0].status !== status) {
        console.log("here::::");
        console.log("status::::", status);

        const obj = {
          task_id: checkExistingTask[0].id,
          user_id: request.currentUser.id,
          status,
        };
        const addTaskHistory = await taskHistoryService.insertOne(obj);
        console.log("addProjectHistory:::", addTaskHistory);
      }

      const updateTask = await taskService.findByIdAndUpdate(filter, data);
      updateTask &&
        response
          .status(200)
          .send({ success: true, message: "Task updated successfully!" });
    } else {
      const rows = await projectService.findById(project_id);
      if (rows && rows.length === 0) {
        response.status(400).send({
          success: false,
          message:
            "Project doesn't exists! Please select valid project to add task.",
        });
      } else {
        const obj = {
          ...request.body,
          created_by: request.currentUser.id,
        };
        const data = await taskService.insertOne(obj);
        let task_id = data.insertId;

        if (data.affectedRows === 1 && data.insertId) {
          const obj = {
            task_id,
            user_id: request.currentUser.id,
            status,
          };
          const addTaskHistory = await taskHistoryService.insertOne(obj);
          console.log("addProjectHistory:::", addTaskHistory);
        }

        if (
          data.affectedRows === 1 &&
          data.insertId &&
          team_id &&
          team_id.length > 0
        ) {
          for (const id of team_id) {
            const obj = {
              task_id,
              user_id: id,
            };
            const data = await taskAssignService.insertOne(obj);
          }
        }

        data &&
          response
            .status(200)
            .send({ success: true, message: "Task created successfully!" });
      }
    }
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

const getAllTasks = async (request, response) => {
  try {
    let { taskname, project_id, status } = request.query;
    let filterQuery = {
      taskname,
      project_id,
      status,
    };
    let data = await taskService.findAll(filterQuery);
    response.status(200).send({ success: true, data });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

const deleteTask = async (request, response) => {
  try {
    const { id } = request.query;
    if (!id) throw new Error("Please pass valid Id to delete!");

    const data = await taskService.deleteOne(id);
    response
      .status(200)
      .send({ success: true, message: "Task deleted Successfully!" });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

const assignTeamToTask = async (request, response) => {
  try {
    const { task_id, team_id } = request.body;
    const checkExistingTask = await taskService.findById(task_id);
    if (checkExistingTask && checkExistingTask.length === 0)
      throw new Error(`Task does not exist.`);

    if (team_id && team_id.length > 0) {
      for (const id of team_id) {
        const obj = {
          task_id,
          user_id: id,
        };
        const data = await taskAssignService.insertOne(obj);
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

const updateTaskHour = async (request, response) => {
  try {
    const { task_id, hour } = request.body;
    console.log("request.currentUser:::", request.currentUser);
    let filter = {
      task_id,
      user_id: request.currentUser.id,
    };

    const checkExistingTask = await taskAssignService.findOne(filter);
    if (checkExistingTask && checkExistingTask.length === 0)
      throw new Error(`Task With currentUser Doen't exist!`);
    console.log("checkExistingProject:::", checkExistingTask);

    const updateHours = await taskAssignService.findOneAndUpdate(filter, hour);

    console.log("updateHours:::", updateHours);

    updateHours.affectedRows === 1 &&
      response.status(200).send({
        success: true,
        message: "Hours updated for Task successfully!",
      });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

export default {
  addUpdateTask,
  getAllTasks,
  deleteTask,
  assignTeamToTask,
  updateTaskHour,
};
