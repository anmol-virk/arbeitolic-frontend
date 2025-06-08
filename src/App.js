import { useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

const App = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    setErrorMessage("")

    try {
      const response = await axios.post("https://arbeitolic-backend.vercel.app/user/login", {
    email, password});

      const token = response.data.token
        localStorage.setItem("adminToken", token);
        setErrorMessage("");
        setIsLoading("Login successful.")
        navigate("/dashboard")      
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };
   
  return (
    <div className='container py-4'>
      <Link className='btn btn-primary float-end' to="/user/signup">Signup</Link>
     <h1 className='text-center py-4'>Arbeitolic Login</h1>
    <div className='position-absolute top-50 start-50 translate-middle col-md-4'>
     <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className='form-control mb-3'
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className='form-control'
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className='btn btn-primary mt-2' type="submit">Login</button>
      </form>
      {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
       {isLoading}
    </div>
    </div>
  );
}

export default App;
