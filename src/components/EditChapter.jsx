import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCsrfTokenFromCookie } from "../misc/Api"; 

function EditChapter() {
  const { id } = useParams(); // Get chapter ID from URL
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    // Fetch the chapter data based on ID
    const fetchChapter = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/works/chapters/${id}/`);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        console.error("Error fetching chapter data:", error);
        toast.error("Failed to fetch chapter. Please try again later.");
      }
    };

    fetchChapter();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    const csrfToken = getCsrfTokenFromCookie("csrftoken");
  
    try {
      const response = await axios.put(
        `http://localhost:8000/works/chapters/${id}/`,
        { title, content },
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true, // Ensure credentials are sent with the request
        }
      );
      toast.success("Chapter updated successfully!");
    } catch (error) {
      console.error("Error details:", error.response?.data); // Log the error response for details
      const errorMessage = error.response?.data?.work?.[0] || "Failed to update chapter. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mx-auto">
        <div className="col-sm-8 col-md-6">
          <div className="card shadow-lg rounded">
            <h2 className="card-title p-3">Edit Chapter</h2>
            <form onSubmit={handleUpdate}>
              <div className="card-body">
                <div className="form-group mb-3">
                  <label htmlFor="title">Chapter Title</label>
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
                  <label htmlFor="content">Content</label>
                  <textarea
                    className="form-control"
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="10"
                    required
                  />
                </div>
              </div>
              <div className="card-footer">
                <button type="submit" className="btn btn-sw mt-3">
                  Save Changes
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

export default EditChapter;
