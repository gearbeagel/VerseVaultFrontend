import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";

function WorkDetail() {
  const languageMap = {
    en: "English",
    fr: "French",
    es: "Spanish",
    de: "German",
    uk: "Ukrainian",
  };
  
  const { id } = useParams(); // Get Work ID from URL
  const [work, setWork] = useState(null);
  const [tags, setTags] = useState({});
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Added for error state

  useEffect(() => {
    const fetchWork = async () => {
      try {
        // Fetch work details
        const workResponse = await axios.get(`http://localhost:8000/works/works/${id}/`, {
          withCredentials: true
        });
        setWork(workResponse.data);

        // Fetch tags
        const tagResponse = await axios.get("http://localhost:8000/works/tags/", {
          withCredentials: true
        });
        const tagData = tagResponse.data.reduce((acc, tag) => {
          acc[tag.id] = tag.name;
          return acc;
        }, {});
        setTags(tagData);

        // Fetch chapters
        const chapterResponse = await axios.get(`http://localhost:8000/works/chapters/?work=${id}`, {
          withCredentials: true
        });
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
          <div className="card shadow-lg rounded" style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <h2 className="card-title p-3">
              {work.title}{" "}
              <small className="text-m">{work.posted ? "" : "(Draft)"}</small>
            </h2>
            <div className="card-body">
              {error ? (
                <p className="text-danger">{error}</p>
              ) : (
                <>
                  <div className="card-text">
                    {work.tags.length > 0 ? (
                      <div>
                        {work.tags.map((tagId) => (
                          <span key={tagId} className="badge bg-sw badge-tag me-2">
                            {tags[tagId] || "Unknown"}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p>No tags available.</p>
                    )}
                  </div>
                  <p><strong>Language:</strong> {languageMap[work.language] || "Unknown"}</p>
                  <p><strong>Word Count:</strong> {work.word_count}</p>
                  <p><strong>Posted:</strong> {format(new Date(work.created_at), "PPP")}</p>
                  <hr />
                  <p className="card-text">{work.summary}</p>
                </>
              )}
            </div>
          </div>

          {/* Chapters Card */}
          <div className="card shadow-lg rounded mt-4" style={{ maxWidth: "1000px", margin: "20px auto" }}>
            <h4 className="card-title p-3">Chapters</h4>
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
