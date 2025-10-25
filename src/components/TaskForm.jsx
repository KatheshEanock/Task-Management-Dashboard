"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  TASK_TYPES,
  PRIORITIES,
  BUG_SEVERITIES,
  STATUSES,
} from "../api/mockApi";
import {
  createTaskRequest,
  updateTaskRequest,
} from "../store/actions/taskActions";
import { closeTaskForm } from "../store/actions/uiActions";
import {
  selectTaskFormState,
  selectTaskFormTaskId,
  selectTasksById,
  selectAllUsers,
  selectAllProjects,
  selectLoading,
  selectError,
} from "../store/selectors/taskSelectors";

const TaskForm = () => {
  const dispatch = useDispatch();
  const taskFormState = useSelector(selectTaskFormState);
  const taskId = useSelector(selectTaskFormTaskId);
  const tasksById = useSelector(selectTasksById);
  const users = useSelector(selectAllUsers);
  const projects = useSelector(selectAllProjects);
  const loading = useSelector(selectLoading);
  const errors = useSelector(selectError);

  const currentTask = taskId ? tasksById[taskId] : null;
  const isEditMode = taskFormState.mode === "edit";

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors: formErrors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: currentTask?.title || "",
      description: currentTask?.description || "",
      taskType: currentTask?.taskType || "Bug",
      priority: currentTask?.priority || "Medium",
      status: currentTask?.status || "Todo",
      projectId: currentTask?.projectId || "",
      assigneeId: currentTask?.assigneeId || "",
      dueDate: currentTask?.dueDate || "",
      severity: currentTask?.severity || "Medium",
      stepsToReproduce: currentTask?.stepsToReproduce || "",
      businessValue: currentTask?.businessValue || "",
      acceptanceCriteria: currentTask?.acceptanceCriteria || [""],
      subtasks: currentTask?.subtasks || [{ title: "", completed: false }],
    },
  });

  const taskType = watch("taskType");
  const projectId = watch("projectId");

  const {
    fields: acceptanceCriteriaFields,
    append: appendCriteria,
    remove: removeCriteria,
  } = useFieldArray({
    control,
    name: "acceptanceCriteria",
  });

  const {
    fields: subtasksFields,
    append: appendSubtask,
    remove: removeSubtask,
  } = useFieldArray({
    control,
    name: "subtasks",
  });

  const projectUsers = React.useMemo(() => {
    if (!projectId) return users;
    const project = projects.find((p) => p.id === projectId);
    if (!project) return users;
    return users.filter((user) => project.userIds.includes(user.id));
  }, [projectId, projects, users]);

  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem("taskFormDraft", JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (!isEditMode && !currentTask) {
      const savedDraft = localStorage.getItem("taskFormDraft");
      if (savedDraft) {
        try {
          reset(JSON.parse(savedDraft));
        } catch (e) {
          console.error("Failed to restore form draft:", e);
        }
      }
    }
  }, [isEditMode, currentTask, reset]);

  const onSubmit = (data) => {
    if (isEditMode && taskId) {
      dispatch(updateTaskRequest(taskId, data));
    } else {
      dispatch(createTaskRequest(data));
    }
    localStorage.removeItem("taskFormDraft");
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeTaskForm());
  };

  const renderDynamicFields = () => {
    switch (taskType) {
      case "Bug":
        return (
          <div className="form-section">
            <h3>Bug Details</h3>
            <div className="form-group">
              <label htmlFor="severity">Severity *</label>
              <select
                id="severity"
                {...register("severity", { required: "Severity is required" })}
              >
                {BUG_SEVERITIES.map((sev) => (
                  <option key={sev} value={sev}>
                    {sev}
                  </option>
                ))}
              </select>
              {formErrors.severity && (
                <span className="error">{formErrors.severity.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="stepsToReproduce">Steps to Reproduce</label>
              <textarea
                id="stepsToReproduce"
                {...register("stepsToReproduce")}
                placeholder="1. Step one&#10;2. Step two&#10;3. Expected vs actual result"
                rows={4}
              />
            </div>
          </div>
        );

      case "Feature":
        return (
          <div className="form-section">
            <h3>Feature Details</h3>
            <div className="form-group">
              <label htmlFor="businessValue">Business Value</label>
              <textarea
                id="businessValue"
                {...register("businessValue")}
                placeholder="Describe the business value of this feature"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Acceptance Criteria</label>
              {acceptanceCriteriaFields.map((field, index) => (
                <div key={field.id} className="field-array-item">
                  <input
                    {...register(`acceptanceCriteria.${index}`)}
                    placeholder={`Criterion ${index + 1}`}
                  />
                  {acceptanceCriteriaFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCriteria(index)}
                      className="btn-remove"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendCriteria("")}
                className="btn-add"
              >
                + Add Criterion
              </button>
            </div>
          </div>
        );

      case "Enhancement":
        return (
          <div className="form-section">
            <h3>Enhancement Details</h3>
            <div className="form-group">
              <label htmlFor="currentBehavior">Current Behavior</label>
              <textarea
                id="currentBehavior"
                {...register("currentBehavior")}
                placeholder="Describe the current behavior"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="proposedBehavior">Proposed Behavior</label>
              <textarea
                id="proposedBehavior"
                {...register("proposedBehavior")}
                placeholder="Describe the proposed behavior"
                rows={3}
              />
            </div>
          </div>
        );

      case "Research":
        return (
          <div className="form-section">
            <h3>Research Details</h3>
            <div className="form-group">
              <label>Research Questions</label>
              {acceptanceCriteriaFields.map((field, index) => (
                <div key={field.id} className="field-array-item">
                  <input
                    {...register(`acceptanceCriteria.${index}`)}
                    placeholder={`Question ${index + 1}`}
                  />
                  {acceptanceCriteriaFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCriteria(index)}
                      className="btn-remove"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendCriteria("")}
                className="btn-add"
              >
                + Add Question
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="expectedOutcomes">Expected Outcomes</label>
              <textarea
                id="expectedOutcomes"
                {...register("expectedOutcomes")}
                placeholder="Describe the expected outcomes"
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!taskFormState.isOpen) return null;

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <div className="task-form-header">
          <h2>{isEditMode ? "Edit Task" : "Create New Task"}</h2>
          <button onClick={handleClose} className="btn-close">
            ×
          </button>
        </div>

        {errors.form && <div className="error-banner">{errors.form}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="task-form-content">
          {/* Basic Fields */}
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                style={{}}
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                })}
                placeholder="Enter task title"
              />
              {formErrors.title && (
                <span
                  className="error"
                  style={{ color: "red", fontSize: "0.875rem" }}
                >
                  {formErrors.title.message}
                </span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="taskType">Task Type *</label>
                <select
                  id="taskType"
                  {...register("taskType", {
                    required: "Task type is required",
                  })}
                >
                  {TASK_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {formErrors.taskType && (
                  <span className="error">{formErrors.taskType.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority *</label>
                <select
                  id="priority"
                  {...register("priority", {
                    required: "Priority is required",
                  })}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                {formErrors.priority && (
                  <span className="error">{formErrors.priority.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  {...register("status", { required: "Status is required" })}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {formErrors.status && (
                  <span className="error">{formErrors.status.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* Assignment Fields */}
          <div className="form-section">
            <h3>Assignment</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="projectId">Project</label>
                <select id="projectId" {...register("projectId")}>
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="assigneeId">Assignee</label>
                <select id="assigneeId" {...register("assigneeId")}>
                  <option value="">Unassigned</option>
                  {projectUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input id="dueDate" type="date" {...register("dueDate")} />
              </div>
            </div>
          </div>

          {/* Dynamic Fields */}
          {renderDynamicFields()}

          {/* Subtasks */}
          <div className="form-section">
            <h3>Subtasks</h3>
            {subtasksFields.map((field, index) => (
              <div
                key={field.id}
                className="field-array-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "space-between",
                  padding: "3px",
                }}
              >
                <input
                  {...register(`subtasks.${index}.title`)}
                  placeholder={`Subtask ${index + 1}`}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                  }}
                />

                <button
                  type="button"
                  onClick={() => removeSubtask(index)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendSubtask({ title: "", completed: false })}
            >
              + Add Subtask
            </button>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={handleClose} className="btn-cancel">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading.tasks || !isValid}
              className="btn-submit"
            >
              {loading.tasks
                ? "Saving..."
                : isEditMode
                ? "Update Task"
                : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
