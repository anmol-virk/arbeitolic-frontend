import React, { useState, useEffect } from "react";
import axios from "axios";
import LogoutButton from "../components/Logout";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const TeamView = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [owners, setOwners] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [error, setError] = useState(null);
  const [newTeam, setNewTeam] = useState({ name: "", description: "" });
  const [selectedTeam, setSelectedTeam] = useState(searchParams.get("team") || "");
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

  const Prefix_url = "https://arbeitolic-backend.vercel.app"
  const fetchData = async () => {
    try {
      const [teamRes, taskRes, ownerRes] = await Promise.all([
        axios.get(`${Prefix_url}/teams`, axiosConfig),
        axios.get(`${Prefix_url}/tasks`, axiosConfig),
        axios.get(`${Prefix_url}/users`, axiosConfig),
      ]);

      setTeams(teamRes.data.teams);
      setTasks(taskRes.data.tasks);
      setOwners(ownerRes.data.users);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      alert("Token not present, login please.")
          navigate("/")
    }
  };

  const applyFiltersFromURL = () => {
    const teamId = searchParams.get("team") || "";
    const tagName = searchParams.get("tag") || "";
    const ownerId = searchParams.get("owner") || "";
    const sortOption = searchParams.get("sort") || "";
    filterTasks(teamId, tagName, ownerId, sortOption);
  };

  const updateURLParams = (params) => {
    setSearchParams(params);
  };

  const filterTasks = (teamId, tagName, ownerId, sortOption) => {
    let filtered = tasks.filter((task) => task.team._id === teamId);
    if (tagName) filtered = filtered.filter((task) => task.tags.includes(tagName));
    if (ownerId) filtered = filtered.filter((task) => task.owners.some((owner) => owner._id === ownerId));
    if (sortOption) {
      filtered = [...filtered].sort((a, b) => {
        if (sortOption === "status") return a.status.localeCompare(b.status);
        if (sortOption === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
        return 0;
      });
    }
    setFilteredTasks(filtered);
  };
  const handleAddTeam = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${Prefix_url}/teams`, newTeam, axiosConfig);
        setTeams([...teams, response.data.team]);
        setNewTeam({ name: "", description: "", });
        setShowTeamForm(false);
    } catch (err) {
        setError("Failed to add team");
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
        <h2 className="mb-4 text-primary">Team View</h2>

<div className="row">
  <div className="col-md-12 d-flex flex-wrap gap-3">
    {teams.map(t => (
      <div onClick={() => {
        updateURLParams({team: t._id}); setSelectedTeam(t._id)}} className={`card team-card ${selectedTeam === t._id ? "selected" : ""}`}>
        <div>{t.name}</div>
        </div>
    ))}
      <button className="addTeamBtn" onClick={() => setShowTeamForm(!showTeamForm)}>
            {showTeamForm ? "Cancel" : "+ Add Team"}
          </button>
  </div>
</div> 

  {showTeamForm && (
          <div>
            <h3 className="mb-3">Add New Team</h3>
            <form onSubmit={handleAddTeam}>
              <div className="mb-3">
                <label className="form-label">Team Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">Add Team</button>
            </form>
          </div>
        )}
        {searchParams.get("team") && (
          <div className="card p-4 shadow-sm">
            <h3 className="mb-3">Filters</h3>
            <div className="row g-3">
              <div className="col-md-4">

                <label className="form-label">Filter by Tag:</label>
                <select className="form-select" value={searchParams.get("tag") || ""} onChange={(e) => updateURLParams({ ...Object.fromEntries(searchParams), tag: e.target.value })}>
                  <option value="">All Tags</option>
                  {tagOptions.map((tagName) => (
                    <option key={tagName} value={tagName}>{tagName}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Filter by Owner:</label>
                <select className="form-select" value={searchParams.get("owner") || ""} onChange={(e) => updateURLParams({ ...Object.fromEntries(searchParams), owner: e.target.value })}>
                  <option value="">All Owners</option>
                  {owners.map((owner) => (
                    <option key={owner._id} value={owner._id}>{owner.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Sort By:</label>
                <select className="form-select" value={searchParams.get("sort") || ""} onChange={(e) => updateURLParams({ ...Object.fromEntries(searchParams), sort: e.target.value })}>
                  <option value="">None</option>
                  <option value="status">Status</option>
                  <option value="dueDate">Due Date</option>
                </select>
              </div>
            </div>
          </div>
        )}

<div className="mt-4">
          <h3>Filtered Tasks</h3>
          {filteredTasks.length > 0 ? (
            <div className="row">
              {filteredTasks.map((task) => (
                <div key={task._id} className="col-md-4">
                   <div className="card mb-3">
                   <div className="card-body">
                   <p  className={`status-badge ${task.status.toLowerCase().replace(" ", "-")}`}>{task.status}</p>
                  <h5>{task.name}</h5>
                  <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                  <div><strong>Tags:</strong> {task.tags.join(", ")}</div>
                </div>
                </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No tasks found for the selected filters.</p>
          )}
          </div>
      </div>
    </div>
  );
};

export default TeamView;
