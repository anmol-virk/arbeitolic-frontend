
import React, { useState, useEffect } from "react";
import {useNavigate, Link } from "react-router-dom";
import LogoutButton from "../components/Logout";
import { Bar, Pie } from "react-chartjs-2";
import {
  fetchLastWeekTasks,
  fetchPendingReport,
  fetchClosedTasksReport,
} from "./reportsSection";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Reports = () => {
  const navigate = useNavigate();
  const [lastWeekTasks, setLastWeekTasks] = useState([]);
  const [totalPendingDays, setTotalPendingDays] = useState(0);
  const [closedTasks, setClosedTasks] = useState([]);
  const [groupBy, setGroupBy] = useState("team");


    const getReports = async () => {
      try {
        const [tasks, pendingDays, groupedTasks] = await Promise.all([
          fetchLastWeekTasks(),
          fetchPendingReport(),
          fetchClosedTasksReport(groupBy),
        ]);

        setLastWeekTasks(tasks);
        setTotalPendingDays(pendingDays);
        setClosedTasks(groupedTasks);
      } catch (error) {
        console.error("Error fetching reports:", error);
        alert("Token not present, login please.")
          navigate("/")
      }
    };
    useEffect(() => {
    getReports();
  }, [groupBy]);

  const lastWeekTasksData = {
    labels: lastWeekTasks.map((task) => task.name),
    datasets: [
      {
        label: "Tasks Completed in",
        data: lastWeekTasks.map((task) => task.timeToComplete || 1),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const pendingWorkData = {
    labels: ["Total Pending Work"],
    datasets: [
      {
        label: "Pending Work (Days)",
        data: [totalPendingDays],
        backgroundColor: ["rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  const closedTasksData = {
    labels: closedTasks.map((group) => group._id?.name || "Unknown"),
    datasets: [
      {
        label: `Closed Tasks by ${groupBy}`,
        data: closedTasks.map((group) => group.count),
        backgroundColor: closedTasks.map(
          (_, index) => `rgba(${index * 50}, 99, 132, 0.6)`
        ),
      },
    ],
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
    <div className="container py-5">
      <h1>Reports</h1>

      <section>
        <h2>Total Work Done Last Week</h2>
        {lastWeekTasks.length ? (
          <Bar style={{maxWidth: "1000px", maxHeight: "500px"}} data={lastWeekTasksData} />
        ) : (
          <p>No tasks completed last week.</p>
        )}
      </section>

      <section>
        <h2>Total Days of Work Pending</h2>
        <Bar style={{maxWidth: "1000px", maxHeight: "500px"}} data={pendingWorkData} />
      </section>

      <section>
        <h2>Tasks Closed by {groupBy}</h2>
        <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
          <option value="team">Team</option>
          <option value="owners">Owners</option>
          <option value="project">Project</option>
        </select>
        {closedTasks.length ? (
          <Pie style={{maxWidth: "1000px", maxHeight: "500px"}} data={closedTasksData} />
        ) : (
          <p>No closed tasks available.</p>
        )}
      </section>
    </div>
    </div>
  );
};

export default Reports;
