import {
  FETCH_USERS_SUCCESS,
  FETCH_PROJECTS_SUCCESS,
} from "../actions/taskActions";

const initialState = {
  users: {
    byId: {},
    allIds: [],
  },
  projects: {
    byId: {},
    allIds: [],
  },
};

export const entitiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_SUCCESS: {
      // Make sure payload is an array
      const users = Array.isArray(action.payload) ? action.payload : [];

      const byId = {};
      const allIds = [];

      users.forEach((user) => {
        byId[user.id] = user;
        allIds.push(user.id);
      });

      return {
        ...state,
        users: { byId, allIds },
      };
    }

    case FETCH_PROJECTS_SUCCESS: {
      // Make sure payload is an array
      const projects = Array.isArray(action.payload) ? action.payload : [];

      const byId = {};
      const allIds = [];

      projects.forEach((project) => {
        byId[project.id] = project;
        allIds.push(project.id);
      });

      return {
        ...state,
        projects: { byId, allIds },
      };
    }

    default:
      return state;
  }
};
