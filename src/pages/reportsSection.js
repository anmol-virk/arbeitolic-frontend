import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const axiosConfig = () => {
  const token = localStorage.getItem("adminToken");
  return {
  headers: { Authorization: `Bearer ${token}` },
  }
};

export const fetchLastWeekTasks = async () => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    throw new Error("Token missing. Please log in.");
  }
  
  const response = await axios.get(`${API_BASE_URL}/report/last-week`, axiosConfig());
  return response.data.tasks;
};

export const fetchPendingReport = async () => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    throw new Error("Token missing. Please log in.");
  }  
  const response = await axios.get(`${API_BASE_URL}/report/pending`, axiosConfig());
  return response.data.totalPendingDays;
};

export const fetchClosedTasksReport = async (groupBy) => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    throw new Error("Token missing. Please log in.");
  }  
  const response = await axios.get(`${API_BASE_URL}/report/closed-tasks`, {
    params: { groupBy }, ...axiosConfig()
  });
  return response.data.groupedTasks;
};
