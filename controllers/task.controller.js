import { taskService, projectService } from "../services";

const addUpdateTask = async (request, response) => {
  try {
    const { id, project_id } = request.body;
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

export default {
  addUpdateTask,
  getAllTasks,
  deleteTask,
};
