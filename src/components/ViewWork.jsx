import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { getCsrfTokenFromCookie } from "../misc/Api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"; // Importing required components

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
  const [favorite, setFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editMode, setEditMode] = useState(false); // New edit mode state

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/misc/current_user/",
          {
            withCredentials: true,
          }
        );
        setCurrentUserId(response.data.id);
        console.log(response.data.id);
      } catch (error) {
        toast.error("Failed to fetch current user.");
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const workResponse = await axios.get(
          `http://localhost:8000/works_writing/works/${id}/`,
          {
            withCredentials: true,
          }
        );
        setWork(workResponse.data);

        const tagResponse = await axios.get(
          "http://localhost:8000/works_writing/tags/",
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

        const favoriteResponse = await axios.get(
          `http://localhost:8000/user-auth/favs/?work=${id}`,
          {
            withCredentials: true,
          }
        );
        if (favoriteResponse.data.length > 0) {
          setFavorite(true);
          setFavoriteId(favoriteResponse.data[0].id);
        }
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
                await axios.delete(`http://localhost:8000/works_writing/works/${id}/`, {
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

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const updatedChapters = Array.from(chapters);
    const [movedChapter] = updatedChapters.splice(result.source.index, 1);
    updatedChapters.splice(result.destination.index, 0, movedChapter);

    setChapters(updatedChapters);

    const updatedChapterData = updatedChapters.map((chapter, index) => ({
      id: chapter.id,
      position: index, 
    }));

    try {
      const csrfToken = getCsrfTokenFromCookie("csrftoken");

      await Promise.all(
        updatedChapterData.map((chapter) =>
          axios.put(
            `http://localhost:8000/works_writing/chapters/${chapter.id}/`,
            { position: chapter.position },
            {
              withCredentials: true,
              headers: {
                "X-CSRFToken": csrfToken,
                "Content-Type": "application/json",
              },
            }
          )
        )
      );

      toast.success("Chapters reordered successfully.");
    } catch (error) {
      toast.error("Failed to reorder chapters.");
      console.error(
        "Error details:",
        error.response ? error.response.data : error
      );
    }
  };

  const toggleFavorite = async () => {
    const csrfToken = getCsrfTokenFromCookie("csrftoken");

    if (favorite) {
      try {
        await axios.delete(
          `http://localhost:8000/user-auth/favs/${favoriteId}/`,
          {
            headers: {
              "X-CSRFToken": csrfToken,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setFavorite(false);
        toast.success("Removed from favorites");
      } catch (error) {
        toast.error("Failed to remove from favorites.");
      }
    } else {
      try {
        await axios.post(
          `http://localhost:8000/user-auth/favs/`,
          { work: id },
          {
            headers: {
              "X-CSRFToken": csrfToken,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setFavorite(true);
        toast.success("Added to favorites");
      } catch (error) {
        toast.error("Failed to add to favorites.");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  const isAuthor = work.author === currentUserId; 

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mx-auto">
        <div className="col-12">
          <div
            className="card shadow-lg rounded"
            style={{ maxWidth: "1000px", margin: "0 auto" }}
          >
            <div className="dropdown position-absolute top-0 end-0 my-3 me-3 ">
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
                {isAuthor && (
                  <>
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
                  </>
                )}
                <li>
                  <button
                    className={`dropdown-item btn-sw`}
                    onClick={toggleFavorite}
                  >
                    <i
                      className={`bi ${
                        favorite ? "bi-heart-fill" : "bi-heart"
                      }`}
                    ></i>{" "}
                    {favorite ? "Unfavorite" : "Favorite"}
                  </button>
                </li>
              </ul>
            </div>
            <h2 className="card-title p-3 mt-3">
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

          <div
            className="card shadow-lg rounded mt-4"
            style={{ maxWidth: "1000px", margin: "20px auto" }}
          >
            {isAuthor && (
            <div className="dropdown position-absolute top-0 end-0 my-3 me-3 ">
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
                        onClick={handleAddChapter}
                        className="dropdown-item btn-sw"
                      >
                        {" "}
                        <i className="bi bi-plus-circle"></i> Add Chapter
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item btn-sw"
                        onClick={toggleEditMode}
                      >
                        <i className="bi bi-pen"></i> {editMode ? "Done Editing" : "Edit Order"}
                      </button>
                    </li>
              </ul>
            </div>
            )}
            <h4 className="card-title p-3 d-flex mt-3 justify-content-center align-items-center">
              <span className="me-2">Chapters</span>
            </h4>
            <div className="card-body text-center">
              {chapters.length > 0 ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable-chapters">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="d-flex flex-column align-items-center gap-2"
                      >
                        {chapters.map((chapter, index) => (
                          <Draggable
                            key={chapter.id}
                            draggableId={String(chapter.id)}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="d-flex column"
                              >
                                <a
                                  href={`/chapters/${chapter.id}`}
                                  className="btn btn-sw me-2"
                                  style={{ whiteSpace: "nowrap", width: "300px" }}
                                >
                                  {chapter.title || "Untitled"}
                                </a>
                                {isAuthor && editMode && (
                                  <div>
                                    <button
                                      className="btn btn-sm btn-secondary me-1"
                                      onClick={() =>
                                        onDragEnd({
                                          source: { index },
                                          destination: { index: index - 1 },
                                        })
                                      }
                                      disabled={index === 0}
                                    >
                                      ↑
                                    </button>
                                    <button
                                      className="btn btn-sm btn-secondary"
                                      onClick={() =>
                                        onDragEnd({
                                          source: { index },
                                          destination: { index: index + 1 },
                                        })
                                      }
                                      disabled={index === chapters.length - 1}
                                    >
                                      ↓
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
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
