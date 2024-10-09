import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { getCsrfTokenFromCookie } from "../misc/Api";
import { toast, ToastContainer } from "react-toastify";

function ViewChapter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previousChapter, setPreviousChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);
  const [fontSize, setFontSize] = useState(16); // Default font size

  useEffect(() => {
    axios
      .get(`http://localhost:8000/works_writing/chapters/${id}/`)
      .then((response) => {
        const currentChapter = response.data;
        setChapter(currentChapter);
        setLoading(false);

        return axios.get(
          `http://localhost:8000/works_writing/chapters/?work=${currentChapter.work}`
        );
      })
      .then((response) => {
        const chapters = response.data;
        const sortedChapters = chapters.sort((a, b) => a.position - b.position);
        const currentIndex = sortedChapters.findIndex(
          (ch) => ch.id === parseInt(id)
        );

        if (currentIndex > 0) {
          setPreviousChapter(sortedChapters[currentIndex - 1]);
        }
        if (currentIndex < sortedChapters.length) {
          setNextChapter(sortedChapters[currentIndex + 1]);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    const csrfToken = getCsrfTokenFromCookie("csrftoken");
    const confirmToast = toast(
      <>
        <p>Are you sure you want to delete this chapter?</p>
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-sw me-2"
            onClick={async () => {
              try {
                await axios.delete(
                  `http://localhost:8000/works/chapters/${id}/`,
                  {
                    withCredentials: true,
                    headers: {
                      "X-CSRFToken": csrfToken,
                      "Content-Type": "application/json",
                    },
                  }
                );
                navigate(`/story/${chapter.work}`);
                toast.success("Chapter deleted successfully");
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
      </>,
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        position: "top-center",
      }
    );
  };

  const increaseFontSize = () => setFontSize((prevSize) => Math.min(prevSize + 2, 24));
  const decreaseFontSize = () => setFontSize((prevSize) => Math.max(prevSize - 2, 12));

  if (loading) {
    return <p>Loading chapter...</p>;
  }

  if (error) {
    return <p>Error loading chapter: {error}</p>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mx-auto">
        <div className="col-12">
          <div
            className="card shadow-lg rounded"
            style={{
              maxWidth: "2000px",
              margin: "0 auto",
              position: "relative",
            }}
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
                    onClick={() => navigate(`/chapter-detail/${id}`)}
                  >
                    <i className="bi bi-pen"></i> Edit
                  </button>
                </li>
              </ul>
            </div>
            <button
              className="btn btn-sw position-absolute top-0 start-0 mt-3 ms-3"
              onClick={() => navigate(`/story/${chapter.work}`)}
            >
              Go Back to Work
            </button>

            <div className="position-absolute top-6 end-0 me-3 mt-5 d-flex justify-content-end">
              <button className="btn btn-sw me-2" onClick={decreaseFontSize}>
                A-
              </button>
              <button className="btn btn-sw" onClick={increaseFontSize}>
                A+
              </button>
            </div>

            <h2 className="card-title p-3 mt-3">{chapter.title}</h2>
            <div className="card-body">
              <div
                style={{ fontSize: `${fontSize}px` }}
                dangerouslySetInnerHTML={{ __html: chapter.content }}
              />
            </div>
            <div className="card-footer d-flex justify-content-between">
              <div className="d-flex justify-content-start">
                {previousChapter && (
                  <button
                    className="btn btn-sw me-2"
                    onClick={() => navigate(`/chapters/${previousChapter.id}`)}
                  >
                    &laquo; Previous
                  </button>
                )}
              </div>
              <div className="d-flex justify-content-end">
                {nextChapter && (
                  <button
                    className="btn btn-sw"
                    onClick={() => navigate(`/chapters/${nextChapter.id}`)}
                  >
                    Next &raquo;
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ViewChapter;
