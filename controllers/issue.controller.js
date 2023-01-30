import { taskService, issueService } from "../services";

const addUpdateIssue = async (request, response) => {
  try {
    const { id, task_id, issue } = request.body;
    if (id) {
      const checkExistingIssue = await issueService.findById(id);
      if (checkExistingIssue && checkExistingIssue.length === 0)
        throw new Error(`Task does not exist.`);

      let filter = {
          id,
        },
        data = {
          ...request.body,
          updated_by: request.currentUser.id,
        };
      const updateTask = await issueService.findByIdAndUpdate(filter, data);
      updateTask &&
        response
          .status(200)
          .send({ success: true, message: "Task updated successfully!" });
    } else {
      const rows = await taskService.findById(task_id);
      if (rows && rows.length === 0) {
        response.status(400).send({
          success: false,
          message:
            "Task doesn't exists! Please select valid task to add issue.",
        });
      } else {
        const obj = {
          ...request.body,
          created_by: request.currentUser.id,
        };
        const data = await issueService.insertOne(obj);

        response
          .status(200)
          .send({ success: true, message: "Issue created successfully!" });
      }
    }
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

const getAllIssues = async (request, response) => {
  try {
    let { issue, status } = request.query;
    let filterQuery = {
      issue,
      status,
    };
    let data = await issueService.findAll(filterQuery);
    response.status(200).send({ success: true, data });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

const deleteIssue = async (request, response) => {
  try {
    const { id } = request.query;
    if (!id) throw new Error("Please pass valid Id to delete!");

    const data = await issueService.deleteOne(id);
    response
      .status(200)
      .send({ success: true, message: "Issue deleted Successfully!" });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

export default {
  addUpdateIssue,
  getAllIssues,
  deleteIssue,
};
