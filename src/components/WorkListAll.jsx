import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom'; 

function AllWorks() {
  const [readingWorks, setReadingWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tags, setTags] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const worksPerPage = 10;

  useEffect(() => {
    const fetchReadingWorks = async () => {
      try {
        const readingResponse = await axios.get('http://localhost:8000/works_reading/works/', {
          withCredentials: true,
        });
        setReadingWorks(readingResponse.data);

        const tagResponse = await axios.get('http://localhost:8000/works_writing/tags/');
        const tagData = tagResponse.data.reduce((acc, tag) => {
          acc[tag.id] = tag.name;
          return acc;
        }, {});
        setTags(tagData);
      } catch (error) {
        setError('Failed to fetch reading works.');
        toast.error('Failed to fetch reading works.');
      } finally {
        setLoading(false);
      }
    };

    fetchReadingWorks();
  }, []);

  // Filter works based on search term and selected tag
  const filteredWorks = readingWorks.filter(work => {
    const matchesSearchTerm = work.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? work.tags.includes(parseInt(selectedTag)) : true;
    return matchesSearchTerm && matchesTag;
  });

  const indexOfLastWork = currentPage * worksPerPage;
  const indexOfFirstWork = indexOfLastWork - worksPerPage;
  const currentWorks = filteredWorks.slice(indexOfFirstWork, indexOfLastWork);

  const totalPages = Math.ceil(filteredWorks.length / worksPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5" style={{ color: 'var(--text-color)' }}>Latest Stories</h2>

      {/* Filter section */}
      <div className="mb-4 d-flex justify-content-center">
        <input 
          type="text" 
          placeholder="Search by title..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="form-control w-50 me-3"
        />
        <select 
          className="form-select w-25" 
          value={selectedTag} 
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">All Tags</option>
          {Object.entries(tags).map(([tagId, tagName]) => (
            <option key={tagId} value={tagId}>{tagName}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : (
        <div className="row justify-content-center">
          {currentWorks.map((work) => (
            <div key={work.id} className="col-12 mb-4">
              <div className="card shadow-lg border-0" style={{ maxWidth: '1500px', margin: 'auto 0' }}>
                <Link to={`/story/${work.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h2 className="card-title p-3">{work.title} <small className="text-m">{work.posted ? '' : '(Draft)'}</small></h2>
                </Link>
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
                  <hr />
                  <p className="card-text">{work.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-sw" onClick={handlePrevPage} disabled={currentPage === 1}>
          &laquo; Previous
        </button>
        <button className="btn btn-sw" onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next &raquo;
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AllWorks;
