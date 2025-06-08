import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
  };

  const handleLogout = () => {
    logout(); 
    navigate("/");
  };

  return <button onClick={handleLogout} className="btn btn-danger">Logout</button>;
};

export default LogoutButton;
