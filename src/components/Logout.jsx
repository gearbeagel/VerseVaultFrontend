import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

const Logout = () => {
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/user-auth/logout/',
        {},
        { 
            headers: {
                'Content-Type': 'application/json',
            },
          withCredentials: true,
        }
      );

      console.log(response.data.message);
      navigate(`/`);
      window.location.reload();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <Nav.Link onClick={handleLogout} style={{textDecoration: 'none'}}>
      <i className="bi bi-box-arrow-right" style={{ fontSize: '1.5rem' }}></i> Logout
    </Nav.Link>
  );
};

export default Logout;
