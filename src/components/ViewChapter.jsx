import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ViewChapter() {
  const { id } = useParams(); // Extract the chapter ID from the URL
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previousChapter, setPreviousChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/works/chapters/${id}/`)  // Fetch chapter by ID
      .then((response) => {
        const currentChapter = response.data;
        setChapter(currentChapter);
        setLoading(false);

        // Fetch chapters in the same work to determine previous and next chapters
        return axios.get(`http://localhost:8000/works/chapters/?work=${currentChapter.work}`);
      })
      .then((response) => {
        const chapters = response.data;
        const sortedChapters = chapters.sort((a, b) => a.position - b.position);
        const currentIndex = sortedChapters.findIndex(ch => ch.id === parseInt(id));
        
        if (currentIndex > 0) {
          setPreviousChapter(sortedChapters[currentIndex - 1]);
        }
        if (currentIndex < sortedChapters.length - 1) {
          setNextChapter(sortedChapters[currentIndex + 1]);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

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
            style={{ maxWidth: "2000px", margin: "0 auto", position: 'relative' }}
          >
            <button
              className="btn btn-sw position-absolute top-0 start-0 mt-3 ms-3"
              onClick={() => navigate(-1)}
            >
              Go Back to Work
            </button>
            <h2 className="card-title p-3">{chapter.title}</h2>
            <div className="card-body">
              <div
                dangerouslySetInnerHTML={{ __html: chapter.content }}
              />
            </div>
            <div className="card-footer d-flex justify-content-between">
              <div>
                {previousChapter && (
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => navigate(`/chapters/${previousChapter.id}`)}
                  >
                    &laquo; Previous
                  </button>
                )}
                {nextChapter && (
                  <button
                    className="btn btn-primary"
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
    </div>
  );
}

export default ViewChapter;
