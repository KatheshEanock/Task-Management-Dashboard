// Selectors for accessing task state

import { createSelector } from "reselect";

// Base selectors
const selectTasksState = (state) => state.tasks;
const selectEntitiesState = (state) => state.entities;
const selectUIState = (state) => state.ui;

// Task selectors
export const selectAllTaskIds = createSelector(
  [selectTasksState],
  (tasks) => tasks.allIds
);

export const selectTasksById = createSelector(
  [selectTasksState],
  (tasks) => tasks.byId
);

export const selectAllTasks = createSelector(
  [selectAllTaskIds, selectTasksById],
  (allIds, byId) => allIds.map((id) => byId[id])
);

export const selectTaskById = (taskId) =>
  createSelector([selectTasksById], (byId) => byId[taskId]);

export const selectOptimisticUpdates = createSelector(
  [selectTasksState],
  (tasks) => tasks.optimisticUpdates
);

// Filtered tasks selector
export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectUIState],
  (tasks, ui) => {
    let filtered = tasks;

    if (ui.filters.projectId) {
      filtered = filtered.filter(
        (task) => task.projectId === ui.filters.projectId
      );
    }

    if (ui.filters.assigneeId) {
      filtered = filtered.filter(
        (task) => task.assigneeId === ui.filters.assigneeId
      );
    }

    if (ui.filters.status && ui.filters.status !== "all") {
      filtered = filtered.filter((task) => task.status === ui.filters.status);
    }

    if (ui.filters.taskType && ui.filters.taskType !== "all") {
      filtered = filtered.filter(
        (task) => task.taskType === ui.filters.taskType
      );
    }

    if (ui.filters.search) {
      const searchLower = ui.filters.search.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }
);

// Entity selectors
export const selectAllUsers = createSelector(
  [selectEntitiesState],
  (entities) => entities.users.allIds.map((id) => entities.users.byId[id])
);

export const selectTasksArray = createSelector(
  [selectAllTaskIds, selectTasksById],
  (allIds, byId) => allIds.map((id) => byId[id])
);

export const selectAllProjects = createSelector(
  [selectEntitiesState],
  (entities) => entities.projects.allIds.map((id) => entities.projects.byId[id])
);

export const selectUserById = (userId) =>
  createSelector(
    [selectEntitiesState],
    (entities) => entities.users.byId[userId]
  );

export const selectProjectById = (projectId) =>
  createSelector(
    [selectEntitiesState],
    (entities) => entities.projects.byId[projectId]
  );

// UI selectors
export const selectTaskFormState = createSelector(
  [selectUIState],
  (ui) => ui.taskForm
);

export const selectFilters = createSelector(
  [selectUIState],
  (ui) => ui.filters
);

export const selectLoading = createSelector(
  [selectUIState],
  (ui) => ui.loading
);

export const selectError = createSelector([selectUIState], (ui) => ui.errors);

export const selectIsTaskFormOpen = createSelector(
  [selectTaskFormState],
  (taskForm) => taskForm.isOpen
);

export const selectTaskFormMode = createSelector(
  [selectTaskFormState],
  (taskForm) => taskForm.mode
);

export const selectTaskFormTaskId = createSelector(
  [selectTaskFormState],
  (taskForm) => taskForm.taskId
);

export const selectFormOpen = createSelector(
  [selectUIState],
  (ui) => ui.taskForm.isOpen
);
