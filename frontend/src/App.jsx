import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Get all tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      setLoading(true);

      await axios.post(API_URL, {
        title: title,
      });

      setTitle("");
      fetchTasks();
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Complete / uncomplete task
  const toggleTask = async (task) => {
    try {
      await axios.put(`${API_URL}/${task.id}`, {
        title: task.title,
        completed: !task.completed,
      });

      fetchTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Task Manager</h1>

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="Enter a task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Task"}
          </button>
        </form>

        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="empty">No tasks yet.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`task ${
                  task.completed ? "completed" : ""
                }`}
              >
                <div className="task-info">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                  />

                  <span>{task.title}</span>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;