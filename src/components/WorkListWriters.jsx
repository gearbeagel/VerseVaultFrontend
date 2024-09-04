import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function YourWorks() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tags, setTags] = useState({});

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const workResponse = await axios.get('http://localhost:8000/works/works/', {
          withCredentials: true,
        });
        setWorks(workResponse.data);

        // Fetch tags
        const tagResponse = await axios.get('http://localhost:8000/works/tags/');
        const tagData = tagResponse.data.reduce((acc, tag) => {
          acc[tag.id] = tag.name;
          return acc;
        }, {});
        setTags(tagData);
      } catch (error) {
        setError('Failed to fetch works.');
        toast.error('Failed to fetch works.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" style={{ color: 'var(--text-color)' }}>Your Works</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : (
        <div className="row justify-content-center">
          {works.map((work) => (
            <div key={work.id} className="col-md-8 col-lg-6 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title">{work.title}</h5>
                  <p className="card-text">
                    {work.tags.length > 0 && (
                      <div>
                        {work.tags.map(tagId => (
                          <span key={tagId} className="badge bg-sw badge-tag me-2">
                            {tags[tagId] || "Unknown"}
                          </span>
                        ))}
                      </div>
                    )}
                  </p>
                  <p className="card-text"><small className="text-m">Language: {work.language}</small></p>
                  <p className="card-text"><small className="text-m">{work.posted ? '' : 'Draft'}</small></p>
                  <hr/>
                  <p className="card-text">{work.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default YourWorks;
