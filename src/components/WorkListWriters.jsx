import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function YourWorks() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/works/works/', {
          withCredentials: true,
        });
        setWorks(response.data);
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
      <h2>Your Works</h2>
        <ul>
          {works.map((work) => (
            <li key={work.id}>{work.title}</li>
          ))}
        </ul>
      )
      <ToastContainer />
    </div>
  );
}

export default YourWorks;
