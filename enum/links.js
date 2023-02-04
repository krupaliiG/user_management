export default {
  BASE_API_URL: "/api/v1/",

  USER: {
    BASE_URL: "/api/v1/users",
    SIGNUP: "/register",
    LOGIN: "/login",
    CHANGE_PASSWORD: "/changePassword",
    FORGET_PASSWORD: "/forgetPassword",
  },
  ROLE: {
    BASE_URL: "/api/v1/role",
    CREATE_USER: "/addUpdateUser",
    GET_USER: "/getAllUser",
    DELETE_USER: "/deleteUser",
  },
  PROJECT: {
    BASE_URL: "/api/v1/project",
    CREATE_PROJECT: "/addUpdateProject",
    GET_PROJECT: "/getAllProjects",
    DELETE_PROJECT: "/deleteProject",
    ASSIGN_TEAM_TO_PROJECT: "/assignTeamToProject",
    UPDATE_HOUR: "/updateHour",
  },
  TASK: {
    BASE_URL: "/api/v1/task",
    CREATE_TASK: "/addUpdateTask",
    GET_TASK: "/getAllTasks",
    DELETE_TASK: "/deleteTask",
    ASSIGN_TEAM_TO_TASK: "/assignTeamToTask",
  },
  ISSUE: {
    BASE_URL: "/api/v1/issue",
    CREATE_ISSUE: "/addUpdateIssue",
    GET_ISSUE: "/getAllIssues",
    DELETE_ISSUE: "/deleteIssue",
    ASSIGN_TEAM_TO_ISSUE: "/assignTeamToIssue",
  },
};
