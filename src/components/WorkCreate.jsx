import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { getCsrfTokenFromCookie } from "../misc/Api";

function WorkCreate() {
  const [formData, setFormData] = useState({
    title: "",
    language: "en",
    summary: "",
  });
  const { title, language, summary } = formData;

  const [tags, setTags] = useState({ allTags: [], selectedTags: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [activeTagIndex, setActiveTagIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { workId } = useParams();
  
  const MAX_TITLE_LENGTH = 100;
  const MAX_SUMMARY_LENGTH = 500;
  
  useEffect(() => {
    const fetchTags = async () => {
      const csrfToken = getCsrfTokenFromCookie("csrftoken");
      try {
        const response = await axios.get("http://localhost:8000/works_writing/tags/", {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        });
        setTags((prev) => ({ ...prev, allTags: response.data }));
        setFilteredTags(response.data);
      } catch (error) {
        toast.error("Failed to fetch tags.");
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    if (workId) {
      const fetchWorkDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/works_writing/works/${workId}/`,
            { withCredentials: true }
          );
  
          const { title, language, summary, tags: tagIds } = response.data;
  
          const tagResponses = await Promise.all(
            tagIds.map((tagId) =>
              axios.get(`http://localhost:8000/works_writing/tags/${tagId}/`, {
                withCredentials: true,
              })
            )
          );
  
          const tags = tagResponses.map((res) => res.data);
  
          setFormData({ title, language, summary });
          setTags((prev) => ({ ...prev, selectedTags: tags }));
        } catch (error) {
          toast.error("Failed to fetch work details.");
          console.error(error);
        }
      };
      fetchWorkDetails();
    }
  }, [workId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredTags(
      tags.allTags.filter((tag) => tag.name.toLowerCase().includes(query))
    );
    setShowTagDropdown(query.length > 0);
    setActiveTagIndex(-1);
  };

  const handleAddTag = (tag) => {
    if (!tags.selectedTags.some((t) => t.id === tag.id)) {
      setTags((prev) => ({
        ...prev,
        selectedTags: [...prev.selectedTags, tag],
      }));
    }
    setSearchQuery("");
    setFilteredTags(tags.allTags);
    setShowTagDropdown(false);
  };

  const handleRemoveTag = (tagId) => {
    setTags((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.filter((tag) => tag.id !== tagId),
    }));
  };

  const handleKeyDown = (e) => {
    if (showTagDropdown) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveTagIndex((prevIndex) =>
          Math.min(filteredTags.length - 1, prevIndex + 1)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveTagIndex((prevIndex) => Math.max(0, prevIndex - 1));
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (activeTagIndex >= 0 && activeTagIndex < filteredTags.length) {
          handleAddTag(filteredTags[activeTagIndex]);
        }
      }
    }
  };

  const handleSubmit = async (e, posted) => {
    e.preventDefault();
    setLoading(true);

    const workData = {
      ...formData,
      posted,
      tags: tags.selectedTags.map((tag) => tag.id),
    };

    const csrfToken = getCsrfTokenFromCookie("csrftoken");

    try {
      if (workId) {
        await axios.put(
          `http://localhost:8000/works_writing/works/${workId}/`,
          workData,
          {
            withCredentials: true,
            headers: {
              "X-CSRFToken": csrfToken,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Work updated successfully!");
        setTimeout(() => navigate(`/story/${workId}`), 1000);
      } else {
        const response = await axios.post(
          "http://localhost:8000/works_writing/works/",
          workData,
          {
            withCredentials: true,
            headers: {
              "X-CSRFToken": csrfToken,
              "Content-Type": "application/json",
            },
          }
        );
          setTimeout(() => navigate(`/your-stories`), 1000);
      }
      resetForm();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      language: "en",
      summary: "",
    });
    setTags({ allTags: tags.allTags, selectedTags: [] });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mx-auto">
        <div className="col-sm-8 col-md-6">
          <div className="card shadow-lg rounded">
            <h2 className="card-title p-3">
              {workId ? "Edit Work" : "Create a Work"}
            </h2>
            <form onSubmit={(e) => handleSubmit(e, false)}>
              <div className="card-body">
                <div className="form-group mb-3">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={handleChange}
                    required
                    maxLength={MAX_TITLE_LENGTH}
                  />
                  <small className="form-text text-m text-align-end">
                    {title.length}/{MAX_TITLE_LENGTH} characters
                  </small>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="language">Language</label>
                  <select
                    className="form-control"
                    id="language"
                    value={language}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    maxLength={MAX_SUMMARY_LENGTH}
                  />
                  <small className="form-text text-m right-0">
                    {summary.length}/{MAX_SUMMARY_LENGTH} characters
                  </small>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="tags">Tags</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control"
                      id="tags"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search and select tags"
                      onFocus={() => setShowTagDropdown(true)}
                      onKeyDown={handleKeyDown}
                      ref={searchInputRef}
                    />
                    {showTagDropdown && filteredTags.length > 0 && (
                      <ul
                      className="list-group overflow-y-auto position-absolute w-100 mt-1 dropdown-menu"
                      ref={dropdownRef}
                      style={{ 
                        zIndex: 1000,
                        maxHeight: '200px', // Set the max height you want
                        overflowY: 'auto', // Enable vertical scrolling
                      }}
                    >
                      {filteredTags.map((tag, index) => (
                        <li
                          key={tag.id}
                          className={`list-group-item list-group-item-action ${
                            index === activeTagIndex ? "active" : ""
                          }`}
                          onClick={() => handleAddTag(tag)}
                        >
                          {tag.name}
                        </li>
                      ))}
                    </ul>
                    )}
                  </div>
                  <div className="mt-2">
                    {tags.selectedTags.map((tag) => (
                      <span key={tag.id} className="badge bg-sw me-2 my-1">
                        {tag.name}
                        <button
                          type="button"
                          className="btn-close btn-sm ms-2"
                          aria-label="Remove"
                          onClick={() => handleRemoveTag(tag.id)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card-footer text-center">
                <button
                  type="submit"
                  className="btn btn-sw me-2 mt-3 w-75"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save as Draft"}
                </button>
                <button
                  type="button"
                  className="btn btn-sw mt-3 w-75"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish"}
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
