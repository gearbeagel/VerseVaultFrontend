import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { format } from "date-fns";

function AllBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/works_reading/bookmarks/",
          { withCredentials: true }
        );
        console.log(response.data);
        setBookmarks(response.data);
      } catch (error) {
        setError("Failed to fetch bookmarks.");
        toast.error("Failed to fetch bookmarks.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const formatDate = (date) => {
    return format(new Date(date), "MMMM d, yyyy, h:mm a");
  };

  const fetchWorkAndChapterDetails = async (bookmark) => {
    const workId = bookmark.work;
    const chapterId = bookmark.binded_chapter;

    try {
      // Fetch work details if it exists
      const workResponse = workId
        ? await axios.get(`http://localhost:8000/works_writing/works/${workId}/`)
        : null;

      // Fetch chapter details if it exists
      const chapterResponse = chapterId
        ? await axios.get(`http://localhost:8000/works_writing/chapters/${chapterId}/`)
        : null;

      return {
        work: workResponse ? workResponse.data : null,
        chapter: chapterResponse ? chapterResponse.data : null,
      };
    } catch (error) {
      toast.error("Failed to fetch work or chapter details.");
      return { work: null, chapter: null };
    }
  };

  const renderBookmarks = async () => {
    return Promise.all(
      bookmarks.map(async (bookmark) => {
        const { work, chapter } = await fetchWorkAndChapterDetails(bookmark);
        return { ...bookmark, work, chapter };
      })
    );
  };

  const [fetchedBookmarks, setFetchedBookmarks] = useState([]);

  useEffect(() => {
    const loadBookmarks = async () => {
      const updatedBookmarks = await renderBookmarks();
      setFetchedBookmarks(updatedBookmarks);
    };

    if (bookmarks.length > 0) {
      loadBookmarks();
    }
  }, [bookmarks]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5" style={{ color: "var(--text-color)" }}>
        Bookmarked Stories
      </h2>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner" role="status"></div>
        </div>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : (
        <div className="row justify-content-center">
          {fetchedBookmarks.map((bookmark) => (
            <div key={bookmark.id} className="col-12 mb-4">
              <div
                className="card shadow-lg border-0 position-relative"
                style={{ maxWidth: "1500px", margin: "auto 0" }}
              >
                <div className="card-body">
                  <Link
                    to={
                      bookmark.bm_type === "BM-S" && bookmark.work
                        ? `/story/${bookmark.work.id}`
                        : bookmark.chapter
                        ? `/chapters/${bookmark.chapter.id}`
                        : "#"
                    }
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <h4 className="card-title text-start mb-2">
                      {bookmark.bm_type === "BM-S" && bookmark.work
                        ? bookmark.work.title
                        : bookmark.chapter
                        ? `${bookmark.chapter.title} (${bookmark.work.title})`
                        : "Untitled"}
                    </h4>
                  </Link>

                  {/* Bookmark Icon and Type */}
                  <div className="d-flex justify-content-between align-items-center">
                    <span>
                      <i
                        className="bi bi-bookmark-fill"
                        style={{ marginRight: "8px", color: "#6c757d" }}
                      ></i>
                      {bookmark.bm_type === "BM-S"
                        ? "Story Bookmark"
                        : "Chapter Bookmark"}
                    </span>
                  </div>

                  <p className="card-text">
                    <small className="text-m">
                      <i
                        className="bi bi-clock"
                        style={{ marginRight: "6px" }}
                      ></i>
                      {formatDate(bookmark.created_at)}
                    </small>
                  </p>
                </div>
                {bookmark.note && (
                  <div className="card-footer">
                    <p className="card-text">
                      <small>{bookmark.note}</small>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default AllBookmarks;
