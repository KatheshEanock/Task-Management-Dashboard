"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTaskRequest,
  fetchProjectsSuccess,
  fetchTasksRequest,
  fetchUsersSuccess,
} from "../store/actions/taskActions";
import { openTaskForm } from "../store/actions/uiActions";
import {
  selectFormOpen,
  selectLoading,
  selectError,
  selectAllProjects,
  selectAllUsers,
  selectTasksArray,
} from "../store/selectors/taskSelectors";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import TaskList from "./TaskList";

export const TaskDashboard = () => {
  const dispatch = useDispatch();
  const formOpen = useSelector(selectFormOpen);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const projects = useSelector(selectAllProjects);
  const users = useSelector(selectAllUsers);
  const tasks = useSelector(selectTasksArray);

  const [filters, setFilters] = useState({
    projectId: null,
    assigneeId: null,
    status: "all",
    taskType: "all",
    search: "",
  });

  useEffect(() => {
    dispatch(fetchTasksRequest());
    dispatch(fetchUsersSuccess());
    dispatch(fetchProjectsSuccess());
  }, [dispatch]);

  const handleCreateTask = () => {
    dispatch(openTaskForm("create"));
  };

  const handleEditTask = (taskId) => {
    dispatch(openTaskForm("edit", taskId));
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTaskRequest(taskId));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    dispatch(fetchTasksRequest(newFilters));
  };

  return (
    <div className="task-dashboard">
      <div className="dashboard-header">
        <h1>Task Management Dashboard</h1>
        <button
          onClick={handleCreateTask}
          className="btn-create"
          style={{
            backgroundColor: "#3498db",
            color: "white",
          }}
        >
          + Create Task
        </button>
      </div>

      {error.tasks && (
        <div className="error-banner">
          <p>{error.tasks}</p>
        </div>
      )}

      <FilterBar
        filters={filters}
        projects={projects}
        users={users}
        onFiltersChange={handleFiltersChange}
      />

      <TaskList
        tasks={tasks}
        loading={loading.tasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />

      {formOpen && <TaskForm />}
    </div>
  );
};
