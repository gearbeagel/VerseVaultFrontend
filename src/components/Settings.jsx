import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { getCsrfTokenFromCookie } from "../misc/Api";
import {
  faCat,
  faDog,
  faFrog,
  faCrow,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Settings() {
  const { userId } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    bio: "",
    location: "",
    icon_name: "",
    user_type: "WRITER", // Default user type
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeForm, setActiveForm] = useState("user"); // 'user' or 'profile'
  const [disableWriterFeatures, setDisableWriterFeatures] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        if (activeForm === "user") {
          const response = await axios.get(
            `http://localhost:8000/user-auth/user/${userId}/`,
            {
              withCredentials: true,
            }
          );
          const { username, first_name, last_name, email, user_type } = response.data;
          setFormData({ username, first_name, last_name, email, user_type });
          setDisableWriterFeatures(user_type !== "WRITER");
        } else if (activeForm === "profile") {
          const response = await axios.get(
            `http://localhost:8000/user-auth/profile/${userId}/`,
            {
              withCredentials: true,
            }
          );
          const { bio, location, icon_name, user_type } = response.data;
          setFormData({ bio, location, icon_name, user_type });
          setDisableWriterFeatures(user_type !== "WRITER");
        }
      } catch (err) {
        console.error(`Error fetching ${activeForm} data`, err);
        setError(`Failed to load ${activeForm} data`);
        toast.error(`Failed to load ${activeForm} data`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, activeForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleChange = (e) => {
    const isChecked = e.target.checked;
    const userType = isChecked ? "READER" : "WRITER";
    setFormData({ ...formData, user_type: userType });
  };

  const handleUpdate = async () => {
    try {
      const csrfToken = getCsrfTokenFromCookie("csrftoken");
      const url =
        activeForm === "user"
          ? `http://localhost:8000/user-auth/user/${userId}/`
          : `http://localhost:8000/user-auth/profile/${userId}/`;

      await axios.put(url, formData, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
      });
      toast.success(
        `${
          activeForm.charAt(0).toUpperCase() + activeForm.slice(1)
        } updated successfully`
      );
    } catch (err) {
      console.error(
        `Error updating ${activeForm}`,
        err.response ? err.response.data : err.message
      );
      toast.error(`Failed to update ${activeForm}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mx-0">
        <div className="col-4 h-auto">
          <div className="card shadow-lg rounded">
            <h2 className="card-title text-center mt-3">Settings</h2>
            <hr />
            <ul
              className="list-group list-unstyled"
              style={{ borderTop: "none" }}
            >
              <li
                className={`${activeForm === "user" ? "font-weight-bold" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => setActiveForm("user")}
              >
                <h5>
                  {activeForm === "user" ? (
                    <i
                      className="bi bi-exclamation ml-2"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  ) : (
                    <i className="bi bi-dot" style={{ fontSize: "1.5rem" }}></i>
                  )}
                  Personal Information
                </h5>
              </li>
              <li
                className={`${
                  activeForm === "profile" ? "font-weight-bold" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => setActiveForm("profile")}
              >
                <h5>
                  {activeForm === "profile" ? (
                    <i
                      className="bi bi-exclamation ml-2"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  ) : (
                    <i className="bi bi-dot" style={{ fontSize: "1.5rem" }}></i>
                  )}
                  Profile Customization
                </h5>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-6">
          <div className="card shadow-lg rounded">
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                {activeForm === "user" && (
                  <>
                    <div className="form-group">
                      <label htmlFor="username">Username:</label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label htmlFor="first_name">First Name:</label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label htmlFor="last_name">Last Name:</label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group mt-3 mb-3">
                      <label htmlFor="email">Email:</label>
                      <i
                      className="bi bi-question-circle ms-2"
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="You can't change your email."
                    ></i>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        disabled
                      />
                    </div>
                  </>
                )}

                {activeForm === "profile" && (
                  <>
                    <div className="form-group">
                      <label htmlFor="bio">Bio:</label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="form-control"
                        rows="3"
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label htmlFor="location">Location:</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label>Icon:</label>
                      <div className="d-flex flex-column">
                        <div className="form-check">
                          <input
                            type="radio"
                            id="icon_cat"
                            name="icon_name"
                            value="fa-cat"
                            checked={formData.icon_name === "fa-cat"}
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <label
                            htmlFor="icon_cat"
                            className="form-check-label"
                          >
                            <FontAwesomeIcon icon={faCat} />
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            id="icon_dog"
                            name="icon_name"
                            value="fa-dog"
                            checked={formData.icon_name === "fa-dog"}
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <label
                            htmlFor="icon_dog"
                            className="form-check-label"
                          >
                            <FontAwesomeIcon icon={faDog} />
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            id="icon_frog"
                            name="icon_name"
                            value="fa-frog"
                            checked={formData.icon_name === "fa-frog"}
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <label
                            htmlFor="icon_frog"
                            className="form-check-label"
                          >
                            <FontAwesomeIcon icon={faFrog} />
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            id="icon_crow"
                            name="icon_name"
                            value="fa-crow"
                            checked={formData.icon_name === "fa-crow"}
                            onChange={handleChange}
                            className="form-check-input"
                          />
                          <label
                            htmlFor="icon_crow"
                            className="form-check-label"
                          >
                            <FontAwesomeIcon icon={faCrow} />
                          </label>
                        </div>
                      </div>
                      <div className="form-group mt-3 mb-3">
                      <label htmlFor="user_type">Disable writing features:</label>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckDefault"
                          checked={formData.user_type === "READER"}
                          onChange={handleToggleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexSwitchCheckDefault"
                        >
                          {formData.user_type === "READER" ? "Yes" : "No"}
                        </label>
                      </div>
                    </div>
                    </div>
                  </>
                )}
              </div>
              <div className="card-footer text-center">
                <button type="submit" className="btn btn-sw text-center w-75 mt-3">
                  Save
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

export default Settings;
