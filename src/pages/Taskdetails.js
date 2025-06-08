import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);
  const [owners, setOwners] = useState([]);

  const token = localStorage.getItem("adminToken");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, teamsRes, ownersRes] = await Promise.all([
          axios.get(`http://localhost:3000/tasks/${id}`, axiosConfig),
          axios.get("http://localhost:3000/teams", axiosConfig),
          axios.get("http://localhost:3000/users", axiosConfig),
        ]);

        const taskData = taskRes.data.task;
        setTask(taskData);
        setFormData({
          name: taskData.name,
          status: taskData.status,
          timeToComplete: taskData.timeToComplete,
          tags: taskData.tags.join(", "),
          team: taskData.team?._id || "",
          owners: taskData.owners?.map((owner) => owner._id) || [],
        });
        setTeams(teamsRes.data.teams);
        setOwners(ownersRes.data.users);
      } catch (err) {
        setError("Failed to fetch task details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOwnerChange = (ownerId) => {
    setFormData((prev) => {
      const isSelected = prev.owners.includes(ownerId);
      return {
        ...prev,
        owners: isSelected
          ? prev.owners.filter((id) => id !== ownerId)
          : [...prev.owners, ownerId],
      };
    });
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      };

      const response = await axios.put(
        `http://localhost:3000/tasks/${id}`,
        updatedData,
        axiosConfig
      );

      setTask(response.data.task);
      setEditMode(false);
    } catch (err) {
      alert("Failed to update task.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container py-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        ← Back to Tasks
      </button>
      <button
              className="btn btn-warning float-end"
              onClick={() => setEditMode(true)}
            >
              Edit Task
            </button>

      <div className="card p-4 shadow-lg">
        {editMode ? (
          <>
            <h3>Edit Task</h3>

            <div className="mb-3">
              <label className="form-label">Name:</label>
              <input
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Team:</label>
              <select
                className="form-select"
                name="team"
                value={formData.team}
                onChange={handleChange}
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Owners:</label>
              <div className="d-flex flex-wrap gap-2">
                {owners.map((owner) => (
                  <div key={owner._id} className="form-check me-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={formData.owners.includes(owner._id)}
                      onChange={() => handleOwnerChange(owner._id)}
                      id={`owner-${owner._id}`}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`owner-${owner._id}`}
                    >
                      {owner.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Status:</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Time to Complete:</label>
              <input
                className="form-control"
                name="timeToComplete"
                type="number"
                value={formData.timeToComplete}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Tags:</label>
              <input
                className="form-control"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-primary me-2" onClick={handleUpdate}>
              Save
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2>{task.name}</h2> 
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <p>
              <strong>Time to Complete:</strong> {task.timeToComplete} days
            </p>
            <p>
              <strong>Tags:</strong> {task.tags.join(", ")}
            </p>
            <p>
              <strong>Team:</strong> {task.team.name}
            </p>
            <p>
              <strong>Project:</strong> {task.project.name}
            </p>
            <p>
              <strong>Owners:</strong>{" "}
              {task.owners.map((owner) => owner.name).join(", ")}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;


