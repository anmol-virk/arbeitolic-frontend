import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import './index.css';
import App from './App';
import Signup from './components/signup';
import TaskForm from './pages/TaskForm';
import ProjectView from './pages/ProjectView';
import TaskList from './pages/TaskList';
import TeamView from './pages/TeamView';
import Reports from './pages/Visualizations';
import Dashboard from './pages/dashboard';
//import Management from './pages/projectmanagement';
import TaskDetails from './pages/Taskdetails';
import LogoutButton from './components/Logout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  }, 
  {
    path: "/user/signup",
    element: <Signup />
  },
  {
    path: "/taskform",
    element: <TaskForm />
  },
  {
    path: "/projectview",
    element: <ProjectView />
  },
  {
    path: "/tasklist",
    element: <TaskList />
  },
  {
    path: "/teamview",
    element: <TeamView />
  },
  {
    path: "/reports",
    element: <Reports />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  // {
  //   path: "/management",
  //   element: <Management />
  // },
  {
    path: "/taskdetails/:id",
    element: <TaskDetails />
  },
  {
    path: "/logout",
    element: <LogoutButton />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>
);
