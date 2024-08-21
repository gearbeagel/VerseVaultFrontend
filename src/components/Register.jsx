// Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCsrfTokenFromCookie } from "../misc/Api"; 
import GoogleLoginButton from "./GoogleLoginButton";

function Register() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrfToken = getCsrfTokenFromCookie("csrftoken");

      const response = await axios.post(
        "http://localhost:8000/user-auth/register/",
        { username, first_name: firstName, last_name: lastName, email, password, password_check: passwordCheck },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log('Registration successful, navigating to home...');
        setTimeout(() => navigate(`/`), 2000);
        window.location.reload();
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mx-auto">
        <div className="col-sm-6">
          <div className="card shadow-lg rounded">
            <h2 className="card-title">Register</h2>
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
                  <label htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    className="form-control"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    className="form-control"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <div className="form-group mb-3">
                  <label htmlFor="password_check">Confirm Password</label>
                  <input
                    type="password"
                    id="password_check"
                    className="form-control"
                    value={passwordCheck}
                    onChange={(e) => setPasswordCheck(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center mt-3">
                  <GoogleLoginButton />
                </div>
              </div>
              <div className="mt-3 card-footer text-center">
                <button type="submit" className="btn btn-sw text-center mt-3 w-75">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
