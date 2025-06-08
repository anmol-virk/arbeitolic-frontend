import React, { useEffect, useState } from "react";
import {useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    owners: "",
    team: "",
    tags: "",
    project: "",
    status: "",
    sortBy: "",
  });
  const [teams, setTeams] = useState([]);
  const [owners, setOwners] = useState([]);
  const [projects, setProjects] = useState([]);

  const token = localStorage.getItem("adminToken");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const Prefix_url = "https://arbeitolic-backend.vercel.app"
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsRes, ownersRes, projectsRes] = await Promise.all([
          axios.get(`${Prefix_url}/teams`, axiosConfig),
          axios.get(`${Prefix_url}/users`, axiosConfig),
          axios.get(`${Prefix_url}/projects`, axiosConfig),
        ]);

        setTeams(teamsRes.data.teams);
        setOwners(ownersRes.data.users);
        setProjects(projectsRes.data.projects);
      } catch (err) {
        console.error("Failed to fetch filter data", err.message);
        alert("Token not present, login please.")
        navigate("/")
      }
    };

    fetchData();
  }, []);

  const fetchTasks = async () => {
    const query = new URLSearchParams(filters).toString();
    try {
      const response = await axios.get(`${Prefix_url}/tasks?${query}`, axiosConfig);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks", error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    searchParams.set(name, value);
    setSearchParams(searchParams);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Task List</h2>
      <Link className="sidebar-link" to={"/dashboard"}><button className="addBtn">← Back to Dashboard</button></Link>
      <div className="row">

        <div className="col-md-3">
          <div className="bg-light p-3 rounded shadow-sm">
            <h5 className="mb-3">Filters</h5>

            <div className="mb-3">
              <label className="form-label">Owner</label>
              <select className="form-select" name="owners" onChange={handleFilterChange} value={filters.owners}>
                <option value="">Select Owner</option>
                {owners.map((owner) => (
                  <option key={owner._id} value={owner._id}>{owner.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Team</label>
              <select className="form-select" name="team" onChange={handleFilterChange} value={filters.team}>
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>{team.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Tags</label>
              <select className="form-select" name="tags" onChange={handleFilterChange} value={filters.tags}>
                <option value="">Select Tag</option>
                <option value="Urgent">Urgent</option>
                <option value="Bug">Bug</option>
                <option value="Feature">Feature</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Project</label>
              <select className="form-select" name="project" onChange={handleFilterChange} value={filters.project}>
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>{project.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" onChange={handleFilterChange} value={filters.status}>
                <option value="">Select Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Sort By</label>
              <select className="form-select" name="sortBy" onChange={handleFilterChange} value={filters.sortBy}>
                <option value="">Sort By</option>
                <option value="timeToComplete">Time to Complete</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          {tasks.length === 0 ? (
            <p className="text-muted">No tasks found.</p>
          ) : (
            <div className="row">
              {tasks.map((task) => (
                <div key={task._id} className="col-md-6 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{task.name}</h5>
                      <p className="card-text"><strong>Project:</strong> {task.project?.name}</p>
                      <p className="card-text"><strong>Team:</strong> {task.team?.name}</p>
                      <p className="card-text"><strong>Owners:</strong> {task.owners?.map((owner) => owner.name).join(", ")}</p>
                      <p className="card-text"><strong>Tags:</strong> {task.tags.join(", ")}</p>
                      <p className="card-text"><strong>Status:</strong> {task.status}</p>
                      <p className="card-text"><strong>Time to Complete:</strong> {task.timeToComplete} days</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
