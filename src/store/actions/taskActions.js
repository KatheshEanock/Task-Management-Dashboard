// Task action creators
// Handles all task-related operations with optimistic updates

// Action Types - Task Operations
export const FETCH_TASKS_REQUEST = "FETCH_TASKS_REQUEST";
export const FETCH_TASKS_SUCCESS = "FETCH_TASKS_SUCCESS";
export const FETCH_TASKS_FAILURE = "FETCH_TASKS_FAILURE";

export const CREATE_TASK_REQUEST = "CREATE_TASK_REQUEST";
export const CREATE_TASK_SUCCESS = "CREATE_TASK_SUCCESS";
export const CREATE_TASK_FAILURE = "CREATE_TASK_FAILURE";
export const CREATE_TASK_OPTIMISTIC = "CREATE_TASK_OPTIMISTIC";
export const ROLLBACK_CREATE_TASK = "ROLLBACK_CREATE_TASK";

export const UPDATE_TASK_REQUEST = "UPDATE_TASK_REQUEST";
export const UPDATE_TASK_SUCCESS = "UPDATE_TASK_SUCCESS";
export const UPDATE_TASK_FAILURE = "UPDATE_TASK_FAILURE";
export const UPDATE_TASK_OPTIMISTIC = "UPDATE_TASK_OPTIMISTIC";
export const ROLLBACK_UPDATE_TASK = "ROLLBACK_UPDATE_TASK";

export const DELETE_TASK_REQUEST = "DELETE_TASK_REQUEST";
export const DELETE_TASK_SUCCESS = "DELETE_TASK_SUCCESS";
export const DELETE_TASK_FAILURE = "DELETE_TASK_FAILURE";
export const DELETE_TASK_OPTIMISTIC = "DELETE_TASK_OPTIMISTIC";
export const ROLLBACK_DELETE_TASK = "ROLLBACK_DELETE_TASK";

export const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
export const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
export const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";

export const FETCH_PROJECTS_REQUEST = "FETCH_PROJECTS_REQUEST";
export const FETCH_PROJECTS_SUCCESS = "FETCH_PROJECTS_SUCCESS";
export const FETCH_PROJECTS_FAILURE = "FETCH_PROJECTS_FAILURE";

// Action Creators - Task Operations
export const fetchTasksRequest = (filters = {}) => ({
  type: FETCH_TASKS_REQUEST,
  payload: filters,
});

export const fetchTasksSuccess = (tasks) => ({
  type: FETCH_TASKS_SUCCESS,
  payload: tasks,
});

export const fetchTasksFailure = (error) => ({
  type: FETCH_TASKS_FAILURE,
  payload: error,
});

export const createTaskRequest = (taskData) => ({
  type: CREATE_TASK_REQUEST,
  payload: taskData,
});

export const createTaskOptimistic = (task) => ({
  type: CREATE_TASK_OPTIMISTIC,
  payload: task,
});

export const createTaskSuccess = (task) => ({
  type: CREATE_TASK_SUCCESS,
  payload: task,
});

export const createTaskFailure = (error) => ({
  type: CREATE_TASK_FAILURE,
  payload: error,
});

export const rollbackCreateTask = (tempId) => ({
  type: ROLLBACK_CREATE_TASK,
  payload: tempId,
});

export const updateTaskRequest = (taskId, updates) => ({
  type: UPDATE_TASK_REQUEST,
  payload: { taskId, updates },
});

export const updateTaskOptimistic = (taskId, updates) => ({
  type: UPDATE_TASK_OPTIMISTIC,
  payload: { taskId, updates },
});

export const updateTaskSuccess = (task) => ({
  type: UPDATE_TASK_SUCCESS,
  payload: task,
});

export const updateTaskFailure = (error) => ({
  type: UPDATE_TASK_FAILURE,
  payload: error,
});

export const rollbackUpdateTask = (taskId, previousData) => ({
  type: ROLLBACK_UPDATE_TASK,
  payload: { taskId, previousData },
});

export const deleteTaskRequest = (taskId) => ({
  type: DELETE_TASK_REQUEST,
  payload: taskId,
});

export const deleteTaskOptimistic = (taskId) => ({
  type: DELETE_TASK_OPTIMISTIC,
  payload: taskId,
});

export const deleteTaskSuccess = (taskId) => ({
  type: DELETE_TASK_SUCCESS,
  payload: taskId,
});

export const deleteTaskFailure = (error) => ({
  type: DELETE_TASK_FAILURE,
  payload: error,
});

export const rollbackDeleteTask = (task) => ({
  type: ROLLBACK_DELETE_TASK,
  payload: task,
});

export const fetchUsersFailure = (error) => ({
  type: FETCH_USERS_FAILURE,
  payload: error,
});

export const fetchProjectsFailure = (error) => ({
  type: FETCH_PROJECTS_FAILURE,
  payload: error,
});

export const fetchUsersSuccess = (users) => ({
  type: FETCH_USERS_SUCCESS,
  payload: users,
});

export const fetchProjectsSuccess = (projects) => ({
  type: FETCH_PROJECTS_SUCCESS,
  payload: projects,
});
