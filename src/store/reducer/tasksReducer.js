// Tasks reducer with normalized state structure

import {
  FETCH_TASKS_SUCCESS,
  CREATE_TASK_OPTIMISTIC,
  CREATE_TASK_SUCCESS,
  ROLLBACK_CREATE_TASK,
  UPDATE_TASK_OPTIMISTIC,
  UPDATE_TASK_SUCCESS,
  ROLLBACK_UPDATE_TASK,
  DELETE_TASK_OPTIMISTIC,
  DELETE_TASK_SUCCESS,
  ROLLBACK_DELETE_TASK,
} from "../actions/taskActions";

const initialState = {
  byId: {},
  allIds: [],
  optimisticUpdates: {},
};

export const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TASKS_SUCCESS: {
      const byId = {};
      const allIds = [];
      action.payload.forEach((task) => {
        byId[task.id] = task;
        allIds.push(task.id);
      });
      return { ...state, byId, allIds };
    }

    case CREATE_TASK_OPTIMISTIC: {
      const task = action.payload;
      return {
        ...state,
        byId: { ...state.byId, [task.id]: task },
        allIds: [...state.allIds, task.id],
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [task.id]: true,
        },
      };
    }

    case CREATE_TASK_SUCCESS: {
      const task = action.payload;
      const { [task.id]: _, ...restOptimistic } = state.optimisticUpdates;
      return {
        ...state,
        byId: { ...state.byId, [task.id]: task },
        optimisticUpdates: restOptimistic,
      };
    }

    case ROLLBACK_CREATE_TASK: {
      const tempId = action.payload;
      const { [tempId]: _, ...restOptimistic } = state.optimisticUpdates;
      const newAllIds = state.allIds.filter((id) => id !== tempId);
      const { [tempId]: __, ...restById } = state.byId;
      return {
        ...state,
        byId: restById,
        allIds: newAllIds,
        optimisticUpdates: restOptimistic,
      };
    }

    case UPDATE_TASK_OPTIMISTIC: {
      const { taskId, updates } = action.payload;
      return {
        ...state,
        byId: {
          ...state.byId,
          [taskId]: { ...state.byId[taskId], ...updates },
        },
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [taskId]: true,
        },
      };
    }

    case UPDATE_TASK_SUCCESS: {
      const task = action.payload;
      const { [task.id]: _, ...restOptimistic } = state.optimisticUpdates;
      return {
        ...state,
        byId: { ...state.byId, [task.id]: task },
        optimisticUpdates: restOptimistic,
      };
    }

    case ROLLBACK_UPDATE_TASK: {
      const { taskId, previousData } = action.payload;
      const { [taskId]: _, ...restOptimistic } = state.optimisticUpdates;
      return {
        ...state,
        byId: { ...state.byId, [taskId]: previousData },
        optimisticUpdates: restOptimistic,
      };
    }

    case DELETE_TASK_OPTIMISTIC: {
      const taskId = action.payload;
      return {
        ...state,
        allIds: state.allIds.filter((id) => id !== taskId),
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [taskId]: true,
        },
      };
    }

    case DELETE_TASK_SUCCESS: {
      const taskId = action.payload;
      const { [taskId]: _, ...restOptimistic } = state.optimisticUpdates;
      const { [taskId]: __, ...restById } = state.byId;
      return {
        ...state,
        byId: restById,
        optimisticUpdates: restOptimistic,
      };
    }

    case ROLLBACK_DELETE_TASK: {
      const task = action.payload;
      return {
        ...state,
        byId: { ...state.byId, [task.id]: task },
        allIds: [...state.allIds, task.id],
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [task.id]: false,
        },
      };
    }

    default:
      return state;
  }
};
