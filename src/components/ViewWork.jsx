import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { getCsrfTokenFromCookie } from "../misc/Api";

function WorkDetail() {
  const languageMap = {
    en: "English",
    fr: "French",
    es: "Spanish",
    de: "German",
    uk: "Ukrainian",
  };

  const { id } = useParams(); 
  const navigate = useNavigate();
  const [work, setWork] = useState(null);
  const [tags, setTags] = useState({});
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const workResponse = await axios.get(
          `http://localhost:8000/works/works/${id}/`,
          {
            withCredentials: true,
          }
        );
        setWork(workResponse.data);

        const tagResponse = await axios.get(
          "http://localhost:8000/works/tags/",
          {
            withCredentials: true,
          }
        );
        const tagData = tagResponse.data.reduce((acc, tag) => {
          acc[tag.id] = tag.name;
          return acc;
        }, {});
        setTags(tagData);

        const chapterResponse = await axios.get(
          `http://localhost:8000/works/chapters/?work=${id}`,
          {
            withCredentials: true,
          }
        );
        setChapters(chapterResponse.data);
      } catch (error) {
        setError("Failed to fetch work details.");
        toast.error("Failed to fetch work details.");
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [id]);

  const handleAddChapter = () => {
    navigate(`/chapter-detail/new/${id}`);
  };

  const handleDelete = () => {
    const csrfToken = getCsrfTokenFromCookie("csrftoken");
    const confirmToast = toast(
      <div>
        <p>Are you sure you want to delete this work?</p>
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-sw me-2"
            onClick={async () => {
              try {
                await axios.delete(`http://localhost:8000/works/works/${id}/`, {
                  withCredentials: true,
                  headers: {
                    "X-CSRFToken": csrfToken,
                    "Content-Type": "application/json",
                  },
                });
                navigate("/your-stories");
                toast.success("Work deleted successfully");
              } catch (error) {
                toast.error("Failed to delete work.");
              } finally {
                toast.dismiss(confirmToast);
              }
            }}
          >
            Yes, Delete
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => toast.dismiss(confirmToast)}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        position: "top-center",
      }
    );
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mx-auto">
        <div className="col-12">
          <div
            className="card shadow-lg rounded"
            style={{ maxWidth: "1000px", margin: "0 auto" }}
          >
            <div className="dropdown position-absolute top-0 end-0 mt-3 me-3 ">
              <button
                className="btn btn-sw dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Options
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end bg-sw"
                aria-labelledby="dropdownMenuButton"
              >
                  <li>
                    <button
                      className="dropdown-item btn-sw"
                      onClick={handleDelete}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item btn-sw"
                      onClick={() => navigate(`/edit-story/${id}`)}
                    >
                      <i className="bi bi-pen"></i> Edit
                    </button>
                  </li>
              </ul>
            </div>
            <h2 className="card-title p-3">
              {work.title}{" "}
              <small className="text-m">{work.posted ? "" : "(Draft)"}</small>
            </h2>
            <div className="card-body">
              {error ? (
                <p className="text-danger">{error}</p>
              ) : (
                <>
                  <div className="card-text mb-3">
                    {work.tags.length > 0 ? (
                      <div>
                        {work.tags.map((tagId) => (
                          <span
                            key={tagId}
                            className="badge bg-sw badge-tag me-2"
                          >
                            {tags[tagId] || "Unknown"}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p>No tags available.</p>
                    )}
                  </div>
                  <p>
                    <strong>Language:</strong>{" "}
                    {languageMap[work.language] || "Unknown"}
                  </p>
                  <p>
                    <strong>Word Count:</strong> {work.word_count}
                  </p>
                  <p>
                    <strong>Posted:</strong>{" "}
                    {format(new Date(work.created_at), "PPP")}
                  </p>
                  <hr />
                  <p className="card-text">{work.summary}</p>
                </>
              )}
            </div>
          </div>

          {/* Chapters Card */}
          <div
            className="card shadow-lg rounded mt-4"
            style={{ maxWidth: "1000px", margin: "20px auto" }}
          >
            <h4 className="card-title p-3 d-flex justify-content-center align-items-center">
              <span className="me-2">Chapters</span>
              <button
                onClick={handleAddChapter}
                className="btn btn-sw"
                style={{ borderRadius: "50px" }}
              >
                <i className="bi bi-plus-circle"></i>
              </button>
            </h4>
            <div className="card-body">
              {chapters.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {chapters.map((chapter) => (
                    <a
                      key={chapter.id}
                      href={`/chapters/${chapter.id}`}
                      className="btn btn-sw"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {chapter.title || "Untitled"}
                    </a>
                  ))}
                </div>
              ) : (
                <p>No chapters available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default WorkDetail;
