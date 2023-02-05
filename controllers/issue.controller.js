import {
  taskService,
  issueService,
  issueAssignService,
  taskAssignService,
  issueHistoryService,
} from "../services";

const addUpdateIssue = async (request, response) => {
  try {
    const { id, task_id, team_id, status } = request.body;
    console.log("team_id:::", team_id);

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

      if (checkExistingIssue[0].status !== status) {
        console.log("here::::");
        console.log("status::::", status);

        const obj = {
          issue_id: checkExistingIssue[0].id,
          user_id: request.currentUser.id,
          status,
        };
        const addIssueHistory = await issueHistoryService.insertOne(obj);
        console.log("addIssueHistory:::", addIssueHistory);
      }

      const updateTask = await issueService.findByIdAndUpdate(filter, data);
      updateTask &&
        response
          .status(200)
          .send({ success: true, message: "Issue updated successfully!" });
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
        let issue_id = data.insertId;

        if (data.affectedRows === 1 && data.insertId) {
          const obj = {
            issue_id,
            user_id: request.currentUser.id,
            status,
          };
          const addIssueHistory = await issueHistoryService.insertOne(obj);
          console.log("addIssueHistory:::", addIssueHistory);
        }

        if (
          data.affectedRows === 1 &&
          data.insertId &&
          team_id &&
          team_id.length > 0
        ) {
          for (const id of team_id) {
            const obj = {
              issue_id,
              user_id: id,
            };
            const data = await issueAssignService.insertOne(obj);
          }
        }

        data &&
          response
            .status(200)
            .send({ success: true, message: "Issue created successfully!" });
      }
    }
  } catch (error) {
    console.log(error);
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

const assignTeamToIssue = async (request, response) => {
  try {
    const { issue_id, team_id } = request.body;
    const checkExistingIssue = await issueService.findById(issue_id);
    if (checkExistingIssue && checkExistingIssue.length === 0)
      throw new Error(`Project does not exist.`);

    if (team_id && team_id.length > 0) {
      for (const id of team_id) {
        const obj = {
          project_id,
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

const updateIssueHour = async (request, response) => {
  try {
    const { issue_id, hour } = request.body;
    console.log("request.currentUser:::", request.currentUser);
    let filter = {
      issue_id,
      user_id: request.currentUser.id,
    };

    const checkExistingIssue = await issueAssignService.findOne(filter);
    if (checkExistingIssue && checkExistingIssue.length === 0)
      throw new Error(`Issue With currentUser Doen't exist!`);
    console.log("checkExistingIssue:::", checkExistingIssue);

    const updateHours = await issueAssignService.findOneAndUpdate(filter, hour);

    console.log("updateHours:::", updateHours);

    updateHours.affectedRows === 1 &&
      response.status(200).send({
        success: true,
        message: "Hours updated for Issue successfully!",
      });
  } catch (error) {
    response.status(400).send({ success: false, message: error.message });
  }
};

export default {
  addUpdateIssue,
  getAllIssues,
  deleteIssue,
  assignTeamToIssue,
  updateIssueHour,
};
