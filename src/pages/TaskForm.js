import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from 'react-select'
import { useNavigate } from "react-router-dom";

const TaskForm = () => {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    project: "",
    owners: [],
    team: "",
    tags: [],
    timeToComplete: "",
    dueDate: "",
    status: "To Do",
  });

  const tagOptions = [
    { value: "Urgent", label: "Urgent" },
    { value: "Bug", label: "Bug" },
    { value: "Feature", label: "Feature" }
  ];

  const statusOptions = ["To Do", "In Progress", "Completed", "Blocked"]

  const navigate = useNavigate()
  const token = localStorage.getItem("adminToken");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchFormResources = async () => {
      try {
        const projectsResponse = await axios.get("http://localhost:3000/projects", axiosConfig);
        const teamsResponse = await axios.get("http://localhost:3000/teams", axiosConfig);
        const usersResponse = await axios.get("http://localhost:3000/users", axiosConfig);

        setProjects(projectsResponse.data.projects);
        setTeams(teamsResponse.data.teams);

        const membersOptions = usersResponse.data.users.map(member => ({
          value: member._id,
          label: member.name
        }));
        setTeamMembers(membersOptions);
      } catch (error) {
        console.error("Error fetching form resources:", error);
      }
    };
    fetchFormResources();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOptions, action) => {
    const { name } = action;
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/tasks", formData, axiosConfig);
      setSuccessMessage("Task created successfully!")
      setFormData({
        name: "",
        project: "",
        owners: [],
        team: "",
        tags: [],
        timeToComplete: "",
        dueDate: "",
        status: "To Do",
      })
      navigate("/dashboard")
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <form className="container py-3" onSubmit={handleSubmit}>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <h1>Create New Task</h1>

      <div className="col-md-6"> 
        <label>Task Name:</label>
        <input
        className="form-control"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="col-md-6"> 
        <label>Project:</label>
        <select className="form-control"
          name="project"
          value={formData.project}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>Select a project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <label>Team:</label>
        <select className="form-control"
          name="team"
          value={formData.team}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>Select a team</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <label>Owners:</label>
        <Select 
        isMulti 
        className="basic-multi-select"
          name="owners"
          options={teamMembers}
          value={teamMembers.filter(member => formData.owners.includes(member.value))}
          onChange={handleSelectChange}
        />
      </div>

      <div className="col-md-4">
        <label>Tags:</label>
        <Select
          isMulti
          name="tags"
          options={tagOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          value={tagOptions.filter(tag => 
            formData.tags.includes(tag.value)
          )}
          onChange={handleSelectChange}
        />
      </div>

      <div className="col-md-6">
        <label>Time to Complete:</label>
        <input className="form-control"
          type="number"
          name="timeToComplete"
          value={formData.timeToComplete}
          onChange={handleInputChange}
          required
        />
      </div>
        <div className="col-md-6">
          <label>Due Date:</label>
          <input
        className="form-control"
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleInputChange}
         required
              />
        </div>
    
      <div className="col-md-6">
        <label>Status:</label>
        <select className="form-control"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          required
        >
          {statusOptions.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary mt-2" type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
