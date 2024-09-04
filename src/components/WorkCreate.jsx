import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCsrfTokenFromCookie } from "../misc/Api"; // Ensure this function is correctly implemented

function WorkCreate() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("en"); // Default to English
  const [summary, setSummary] = useState("");

  const handleSubmit = async (e, posted) => {
    e.preventDefault();

    const workData = {
      title,
      language,
      summary,
      posted,
    };

    const csrfToken = getCsrfTokenFromCookie("csrftoken");

    try {
      await axios.post(
        "http://localhost:8000/works/works/",
        workData,
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );
      const message = posted
        ? "Work published successfully!"
        : "Work saved as draft successfully!";
      toast.success(message);
      setTitle("");
      setLanguage("en");
      setSummary("");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Failed to create work.");
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
            <h2 className="card-title p-3">Create a Work</h2>
            <form>
              <div className="card-body">
                <div className="form-group mb-3">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="language">Language</label>
                  <select
                    className="form-control"
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    required
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                    <option value="uk">Ukrainian</option>
                  </select>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="summary">Summary</label>
                  <textarea
                    className="form-control"
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                </div>
              </div>
              <div className="card-footer">
                <button
                  type="button"
                  className="btn btn-sw me-2 mt-3"
                  onClick={(e) => handleSubmit(e, false)}
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  className="btn btn-sw mt-3"
                  onClick={(e) => handleSubmit(e, true)}
                >
                  Publish
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

export default WorkCreate;
