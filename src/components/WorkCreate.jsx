import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCsrfTokenFromCookie } from "../misc/Api"; // Ensure this function is correctly implemented

function WorkCreate() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("en"); // Default to English
  const [summary, setSummary] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [activeTagIndex, setActiveTagIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:8000/works/tags/');
        setAllTags(response.data);
        setFilteredTags(response.data);
      } catch (error) {
        toast.error('Failed to fetch tags.');
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !searchInputRef.current.contains(event.target)) {
        setShowTagDropdown(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredTags(
      allTags.filter(tag =>
        tag.name.toLowerCase().includes(query)
      )
    );
    setShowTagDropdown(query.length > 0);
    setActiveTagIndex(-1);
  };

  const handleAddTag = (tag) => {
    if (!selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setSearchQuery("");
    setFilteredTags(allTags);
    setShowTagDropdown(false);
  };

  const handleRemoveTag = (tagId) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
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
        setActiveTagIndex((prevIndex) =>
          Math.max(0, prevIndex - 1)
        );
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

    const workData = {
      title,
      language,
      summary,
      posted,
      tags: selectedTags.map(tag => tag.id),
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
      setSelectedTags([]);
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
        <div className="col-sm-8 col-md-6">
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
                        className="list-group position-absolute w-100 mt-1 dropdown-menu"
                        ref={dropdownRef}
                        style={{ zIndex: 1000 }}
                      >
                        {filteredTags.map((tag, index) => (
                          <li
                            key={tag.id}
                            className={`list-group-item list-group-item-action ${index === activeTagIndex ? 'active' : ''}`}
                            onClick={() => handleAddTag(tag)}
                          >
                            {tag.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="mt-2">
                    {selectedTags.map(tag => (
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
