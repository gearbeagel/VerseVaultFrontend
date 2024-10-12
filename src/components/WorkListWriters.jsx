import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom'; 

function YourWorks() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tags, setTags] = useState({});

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const workResponse = await axios.get('http://localhost:8000/works_writing/works/', {
          withCredentials: true,
        });
        setWorks(workResponse.data);

        const tagResponse = await axios.get('http://localhost:8000/works_writing/tags/');
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
      <h2 className="text-center mb-5" style={{ color: 'var(--text-color)' }}>Your Works</h2>
      {loading ? (
            <div className="text-center mt-5">
              <div className="spinner" role="status"></div>
            </div>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : (
        <div className="row justify-content-center">
          {works.map((work) => (
            <div key={work.id} className="col-12 mb-4">
              <div className="card shadow-lg border-0"  style={{maxWidth: '1500px', margin: 'auto 0'}}>
              <Link to={`/story/${work.id}`} style={{ textDecoration: 'none', color: 'inherit' }}><h2 className="card-title p-3">{work.title} <small className="text-m">{work.posted ? '' : '(Draft)'}</small></h2></Link>
                <div className="card-body">
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
                  <p className="card-text"><small className="text-m">Word Count: {work.word_count}</small></p>
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
