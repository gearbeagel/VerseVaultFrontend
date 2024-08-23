import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import axios from 'axios';

const Homepage = () => {
  const [username, setUsername] = useState('');
  const isAuthenticated = true; // Replace with actual authentication check

  const breakpointColumnsObj = {
    default: 2,
    1100: 2,
    700: 1,
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/misc/current_user/', {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.id) {
          const { username } = response.data;
          setUsername(username);
        } else {
          setUsername('Guest');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUsername('Guest');
      }
    };

    if (isAuthenticated) {
      fetchUser();
    } else {
      setUsername('Guest');
    }
  }, [isAuthenticated]);

  return (
    <div className="container mt-5">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        <div className="card p-5 mb-2 h-auto greeting-card">
          <h1>Hello, {username}.</h1>
          <h6>Welcome!</h6>
        </div>
        <div className="card mb-2 p-5">
          <p>Card 2</p>
        </div>
        <div className="card mb-2 p-5">
          <p>Card 3</p>
        </div>
        <div className="card mb-2 p-5">
          <p>Card 4</p>
        </div>
        <div className="card mb-2 p-5 ">
          <p>Card 5</p>
        </div>
      </Masonry>
    </div>
  );
};

export default Homepage;
