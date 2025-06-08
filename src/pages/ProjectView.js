import React, { useState, useEffect } from "react";
import axios from "axios";
import LogoutButton from "../components/Logout";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ProjectView = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProject, setSelectedProject] = useState(searchParams.get("project") || "");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [error, setError] = useState(null);
  const [owners, setOwners] = useState([]);
  const tagOptions = ["Urgent", "Bug", "Feature"];

  const token = localStorage.getItem("adminToken");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFiltersFromURL();
  }, [searchParams, tasks]);

  const updateURLParams = (params) => {
    setSearchParams(params);
  };

  const handleSelect = (projectId) => {
    setSelectedProject(projectId)
    updateURLParams({project: projectId})
  }
 const Prefix_url = "https://arbeitolic-backend.vercel.app"
  const fetchData = async () => {
    try {
      const [projectRes, taskRes, ownerRes] = await Promise.all([
        axios.get(`${Prefix_url}/projects`, axiosConfig),
        axios.get(`${Prefix_url}/tasks`, axiosConfig),
        axios.get(`${Prefix_url}/users`, axiosConfig),
      ]);

      setProjects(projectRes.data.projects);
      setTasks(taskRes.data.tasks);
      setOwners(ownerRes.data.users);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      alert("Token not present, login please.")
          navigate("/")
    }
  };

  const applyFiltersFromURL = () => {
    const projectId = searchParams.get("project") || "";
    const tagName = searchParams.get("tag") || "";
    const ownerId = searchParams.get("owner") || "";
    filterTasks(projectId, tagName, ownerId);
  };

  const filterTasks = (projectId, tagName, ownerId) => {
    let filtered = tasks.filter((task) => task.project._id === projectId);
    if (tagName) filtered = filtered.filter((task) => task.tags.includes(tagName));
    if (ownerId) filtered = filtered.filter((task) => task.owners.some((owner) => owner._id === ownerId));
    setFilteredTasks(filtered);
  };

  const resetFilters = () => {
    filterTasks(selectedProject, "", "");
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${Prefix_url}/projects`, newProject, axiosConfig);
        setProjects([...projects, response.data.project]);
        setNewProject({ name: "", description: "", });
        setShowProjectForm(false);
    } catch (err) {
        setError("Failed to add project");
    }
};

  return (
    <div className="d-flex container py-4">
    <div className="sidebar">
         <h2 className="mb-4">Arbeitolic</h2>
         <Link className="sidebar-link" to={"/dashboard"}>Dashboard</Link>
         <Link className="sidebar-link" to={"/tasklist"}>Task List</Link>
         <Link className="sidebar-link" to={"/projectview"}>Projects</Link>
       <Link className="sidebar-link" to={"/teamview"}>Teams</Link>
       <Link className="sidebar-link" to={"/reports"}>Reports</Link>
       <Link className="sidebar-link" to={"/"}>Settings</Link>
       <Link className="sidebar-link" to={""}><LogoutButton /></Link>
         </div>
    <div className="container py-4">
      <h2 className="mb-4 text-primary">Project View</h2>

      <div className="row">
  <div className="col-md-12 d-flex flex-wrap gap-3">
    {projects.map(p => (
      <div key={p._id} onClick={() => handleSelect(p._id)} className={`card team-card ${selectedProject === p._id ? "selected" : ""}`}>
        <div>{p.name}</div>
        </div>
    ))}
     <button className="addTeamBtn" onClick={() => setShowProjectForm(!showProjectForm)}>
            {showProjectForm ? "Cancel" : "+ Add Project"}
          </button>
  </div>
</div> 
     
{showProjectForm && (
          <div>
            <h3 className="mb-3">Add New Project</h3>
            <form onSubmit={handleAddProject}>
              <div className="mb-3">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">Add Project</button>
            </form>
          </div>
        )}

      {searchParams.get("project") && (
        <div className="card p-4 shadow-sm">
          <h3 className="mb-3">Filters</h3>
          <div className="row g-3">
            <div className="col-md-4">

              <label className="form-label">Filter by Tag:</label>
              <select className="form-select" value={searchParams.get("tag")} onChange={(e) => updateURLParams({ ...Object.fromEntries(searchParams), tag: e.target.value })}>
                <option value="">All Tags</option>
                {tagOptions.map((tagName) => (
                  <option key={tagName} value={tagName}>{tagName}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Filter by Owner:</label>
              <select className="form-select" value={searchParams.get("owner")} onChange={(e) => updateURLParams({ ...Object.fromEntries(searchParams), owner: e.target.value })}>
                <option value="">All Owners</option>
                {owners.map((owner) => (
                  <option key={owner._id} value={owner._id}>{owner.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-primary w-10" onClick={resetFilters}>Reset Filters</button>
            </div>
          </div>
        </div>
      )}

      {searchParams.get("project") && (
        <div className="mt-4">
          <h3 className="mb-3">Tasks for Selected Project</h3>
          <div className="row">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div key={task._id} className="col-md-6">
                  <div className="card shadow-sm mb-3">
                    <div className="card-body">
                    <p  className={`status-badge ${task.status.toLowerCase().replace(" ", "-")}`}>{task.status}</p>
                      <h4 className="card-title text-primary">{task.name}</h4>
                      <p className="mb-1"><strong>Time to Complete:</strong> {task.timeToComplete} days</p>
                      <p className="mb-1"><strong>Tags:</strong> {task.tags.join(", ")}</p>
                      <p className="mb-0"><strong>Owners:</strong> {task.owners.map((owner) => owner.name).join(", ")}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No tasks found for this project.</p>
            )}
          </div>
        </div>
      )}
     </div>
    </div>
  );
};

export default ProjectView;
