import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://arbeitolic-backend.vercel.app/user/signup", {
         name, email, password
      });
        setMessage("Account created successfully!", response);
        navigate("/")
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container py-4 col-md-4">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Signup</button>
      </form>
      {message && (
        <div className={`mt-3 ${message.includes("success") ? "text-success" : "text-danger"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Signup;
