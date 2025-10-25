// Task sagas for handling async operations

import {
  call,
  delay,
  put,
  race,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { mockApi } from "../../api/mockApi";
import {
  CREATE_TASK_REQUEST,
  createTaskFailure,
  createTaskOptimistic,
  createTaskSuccess,
  DELETE_TASK_REQUEST,
  deleteTaskFailure,
  deleteTaskOptimistic,
  deleteTaskSuccess,
  FETCH_PROJECTS_REQUEST,
  FETCH_PROJECTS_SUCCESS,
  FETCH_TASKS_REQUEST,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  fetchProjectsFailure,
  fetchProjectsSuccess,
  fetchTasksFailure,
  fetchTasksSuccess,
  fetchUsersFailure,
  fetchUsersSuccess,
  rollbackCreateTask,
  rollbackDeleteTask,
  rollbackUpdateTask,
  UPDATE_TASK_REQUEST,
  updateTaskFailure,
  updateTaskOptimistic,
  updateTaskSuccess,
} from "../actions/taskActions";
import { clearError, setError, setLoading } from "../actions/uiActions";

// Fetch Tasks Saga
function* fetchTasksSaga(action) {
  try {
    yield put(setLoading("tasks", true));
    yield put(clearError("tasks"));

    const response = yield call(mockApi.fetchTasks, action.payload);

    yield put(fetchTasksSuccess(response.data));
  } catch (error) {
    yield put(fetchTasksFailure(error.message));
    yield put(setError("tasks", error.message));
  } finally {
    yield put(setLoading("tasks", false));
  }
}

// Create Task Saga with Optimistic Updates
function* createTaskSaga(action) {
  const tempId = `temp_${Date.now()}`;
  const optimisticTask = {
    ...action.payload,
    id: tempId,
    createdAt: new Date().toISOString(),
    status: "Todo",
  };

  try {
    yield put(clearError("form"));
    yield put(createTaskOptimistic(optimisticTask));

    // Race between success and timeout
    const result = yield race({
      success: call(mockApi.createTask, action.payload),
      timeout: delay(30000), // 30 second timeout
    });

    if (result.timeout) {
      throw new Error("Request timeout. Please try again.");
    }

    yield put(createTaskSuccess(result.success.data));
  } catch (error) {
    yield put(rollbackCreateTask(tempId));
    yield put(createTaskFailure(error.message));
    yield put(setError("form", error.message));
  }
}

// Update Task Saga with Optimistic Updates
function* updateTaskSaga(action) {
  const { taskId, updates } = action.payload;
  const state = yield select();
  const previousData = state.tasks.byId[taskId];

  try {
    yield put(clearError("form"));
    yield put(updateTaskOptimistic(taskId, updates));

    const result = yield race({
      success: call(mockApi.updateTask, taskId, updates),
      timeout: delay(30000),
    });

    if (result.timeout) {
      throw new Error("Request timeout. Please try again.");
    }

    yield put(updateTaskSuccess(result.success.data));
  } catch (error) {
    yield put(rollbackUpdateTask(taskId, previousData));
    yield put(updateTaskFailure(error.message));
    yield put(setError("form", error.message));
  }
}

// Delete Task Saga with Optimistic Updates
function* deleteTaskSaga(action) {
  const taskId = action.payload;
  const state = yield select();
  const deletedTask = state.tasks.byId[taskId];

  try {
    yield put(clearError("tasks"));
    yield put(deleteTaskOptimistic(taskId));

    const result = yield race({
      success: call(mockApi.deleteTask, taskId),
      timeout: delay(30000),
    });

    if (result.timeout) {
      throw new Error("Request timeout. Please try again.");
    }

    yield put(deleteTaskSuccess(taskId));
  } catch (error) {
    yield put(rollbackDeleteTask(deletedTask));
    yield put(deleteTaskFailure(error.message));
    yield put(setError("tasks", error.message));
  }
}

// Fetch Users Saga
function* fetchUsersSaga() {
  try {
    yield put(setLoading("users", true));
    yield put(clearError("users"));

    const response = yield call(mockApi.fetchUsers);

    // Make sure response.data is array
    const usersData = Array.isArray(response.data) ? response.data : [];
    yield put(fetchUsersSuccess(usersData));
  } catch (error) {
    console.log("Error fetching users:", error);
    yield put(fetchUsersFailure(error.message));
    yield put(setError("users", error.message));
  } finally {
    yield put(setLoading("users", false));
  }
}

// Fetch Projects Saga
function* fetchProjectsSaga() {
  try {
    yield put(setLoading("projects", true));
    yield put(clearError("projects"));

    const response = yield call(mockApi.fetchProjects);

    const projectsData = Array.isArray(response.data) ? response.data : [];
    yield put(fetchProjectsSuccess(projectsData));
  } catch (error) {
    console.log("Error fetching projects:", error);
    yield put(fetchProjectsFailure(error.message));
    yield put(setError("projects", error.message));
  } finally {
    yield put(setLoading("projects", false));
  }
}

// Watcher Sagas
export function* watchTaskSagas() {
  yield takeLatest(FETCH_TASKS_REQUEST, fetchTasksSaga);
  yield takeEvery(CREATE_TASK_REQUEST, createTaskSaga);
  yield takeEvery(UPDATE_TASK_REQUEST, updateTaskSaga);
  yield takeEvery(DELETE_TASK_REQUEST, deleteTaskSaga);
  yield takeLatest(FETCH_USERS_SUCCESS, fetchUsersSaga);
  yield takeLatest(FETCH_PROJECTS_SUCCESS, fetchProjectsSaga);
}
