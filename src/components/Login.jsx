import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleLoginButton from "./GoogleLoginButton";
import { getCsrfTokenFromCookie } from "../misc/Api"; 
import { useAuth } from "../context/AuthContext"; 

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrfToken = getCsrfTokenFromCookie("csrftoken");

      const response = await axios.post(
        "http://localhost:8000/user-auth/login/",
        { username, password },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      login();
      setTimeout(() => navigate(`/`), 2000);
      window.location.reload();

    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mx-auto">
        <div className="col-sm-6">
          <div className="card shadow-lg rounded">
            <h2 className="card-title">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="form-group mb-3">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center mt-3">
                  <GoogleLoginButton />
                </div>
              </div>
              <div className="mt-3 card-footer text-center">
                <button type="submit" className="btn btn-sw text-center mt-3 w-75">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
