import TaskCard from "./TaskCard";

const TaskList = ({
  tasks = [],
  loading = false,
  onEditTask,
  onDeleteTask,
}) => {
  if (loading) {
    return (
      <div className="task-list-container">
        <div className="task-list-loading">
          <div className="loading-spinner" />
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-container">
        <div className="task-list-empty">
          <h3>No tasks found</h3>
          <p>Create your first task to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list-container">
        <div className="task-list-header">
          <h2>Tasks ({tasks.length})</h2>
        </div>

        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
