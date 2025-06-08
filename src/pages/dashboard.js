import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import axios from "axios";
import LogoutButton from "../components/Logout";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([])
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [error, setError] = useState(null);
    const [errorTasks, setErrorTasks] = useState(null);
    const [filterStatus, setFilterStatus] = useState("All");
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [newProject, setNewProject] = useState({ name: "", description: "" });

    const token = localStorage.getItem("adminToken");
    const axiosConfig = {
      headers: { Authorization: `Bearer ${token}` },
    };

    useEffect(() => {
      setFilteredTasks(tasks); 
    }, [tasks]);
    useEffect(() => {
      const fetchProjects = async () => {
        try {
          const response = await axios.get("http://localhost:3000/projects", axiosConfig); 
          setProjects(response.data.projects);
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch projects");
          setLoading(false);
        }
      };

     const fetchTasks = async () => {
        try {
          const response = await axios.get("http://localhost:3000/tasks", axiosConfig);
          setTasks(response.data.tasks);
          setLoadingTasks(false);
        } catch (err) {
          setErrorTasks("Failed to fetch tasks");
          setLoadingTasks(false);
        }
      };
      fetchProjects();
      fetchTasks()
    }, []);  

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (status === "All") {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) => task.status === status);
      setFilteredTasks(filtered);
    }
  };
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:3000/projects", newProject, axiosConfig);
        setProjects([...projects, response.data.project]);
        setNewProject({ name: "", description: "", });
        setShowProjectForm(false);
    } catch (err) {
        setError("Failed to add project");
    }
};

    return(
        <div className="container py-3 text-center">
        <div className="d-flex">
         <div className="sidebar">
         <h2 className="mb-4">Arbeitolic</h2>
         <Link className="sidebar-link" to={"/dashboard"}>Dashboard</Link>
         <Link className="sidebar-link" to={"/tasklist"}>Task List</Link>
       <Link className="sidebar-link" to={"/projectview"}>Projects</Link>
       <Link className="sidebar-link" to={"/teamview"}>Teams</Link>
       <Link className="sidebar-link" to={"/reports"}>Reports</Link>
       <Link className="sidebar-link" to={"/user/signup"}>Settings</Link>
       <Link className="sidebar-link" to={""}><LogoutButton /></Link>
         </div>
         <div className="p-4 row">
          <h2 className="mb-4">Projects
          <button className="addBtn float-end" onClick={() => setShowProjectForm(true)}>+ Add Project</button>
          </h2>
          {showProjectForm && (
          <form onSubmit={handleAddProject} className="mb-3">
          <input type="text" placeholder="Project Name" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} required className="form-control mb-2" />
         <input type="text" placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} required className="form-control mb-2" />
        <button type="submit" className="btn btn-success">Save</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowProjectForm(false)}>Cancel</button>
     </form>
                    )}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : projects.length > 0 ? (
            <div className="row">
            {projects.map((project) => (
              <div
                key={project._id}
                className="col-md-4 mb-4 taskCard"
              >
                <h5>{project.name}</h5>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
          ) : (
            <p>No projects available</p>
          )}

          <h2>Tasks
          <Link to={"/taskform"}><button className="addBtn float-end">+ New Task</button></Link>
          </h2>
          {loadingTasks ? (
            <p>Loading tasks...</p>
          ) : errorTasks ? (
            <p className="text-danger">{errorTasks}</p>
          ) : tasks.length > 0 ? (
            <>

            <div className="mb-3">
              <button
                className={`btn btn-sm ${
                  filterStatus === "All" ? "btn-primary" : "btn-outline-primary"
                } me-2`}
                onClick={() => handleFilterChange("All")}
              >
                All
              </button>
              <button
                className={`btn btn-sm ${
                  filterStatus === "In Progress"
                    ? "btn-primary"
                    : "btn-outline-primary"
                } me-2`}
                onClick={() => handleFilterChange("In Progress")}
              >
                In Progress
              </button>
              <button
                className={`btn btn-sm ${
                  filterStatus === "Completed"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => handleFilterChange("Completed")}
              >
                Completed
              </button>
            </div>

            <div className="row">      
              {filteredTasks.map((task) => (
                 <div key={task._id} className="col-md-4 col-sm-6 mb-4">
         <Link to={`/taskdetails/${task._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div
                 className="taskCard"
                >
                  <p  className={`status-badge ${task.status.toLowerCase().replace(" ", "-")}`}>{task.status}</p>
                  <h4>{task.name}</h4>
                  <h5>{task.project.name}</h5>
                  <p>{task.project.description}</p>
                </div>
                </Link>
                </div>
              ))}
            </div>
          </>
          
          ) : (
            <p>No tasks available</p>
          )}
        </div>
        
        </div>
        </div>
    )
}

export default Dashboard