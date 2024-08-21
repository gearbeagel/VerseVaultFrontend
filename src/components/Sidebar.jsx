import React, { useState, useEffect } from 'react';
import { Offcanvas, Button, Nav } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Logout from './Logout';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Sidebar({ isAuthenticated }) {
  const { userId, login } = useAuth(); // Get userId and login from AuthContext
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/misc/current_user/', {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.id) {
          const { id, username } = response.data;
          setUsername(username);
          login(id); // Set the userId in AuthContext
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
  }, [isAuthenticated, login]);

  return (
    <>
      <div className={`sidebar-icons d-flex flex-column align-items-center ${show ? 'd-none' : 'd-flex'}`}>
        <Button variant="link" onClick={handleShow} className="p-0 ham-button">
          <i className="bi bi-list" style={{ fontSize: '2rem' }}></i>
        </Button>
        <Nav className="flex-column">
          {isAuthenticated ? (
            <>
              <Nav.Link href={`/profile/${userId || ''}`} className="p-2">
                <i className="bi bi-person" style={{ fontSize: '1.5rem' }}></i>
              </Nav.Link>
              <Nav.Link href="/reading_list" className="p-2">
                <i className="bi bi-book" style={{ fontSize: '1.5rem' }}></i>
              </Nav.Link>
              <Nav.Link className="p-2">
                <i className="bi bi-file-earmark-text" style={{ fontSize: '1.5rem' }}></i>
              </Nav.Link>
              <Nav.Link className="p-2">
                <i className="bi bi-pencil" style={{ fontSize: '1.5rem' }}></i>
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link href="/login" className="p-2">
                <i className="bi bi-box-arrow-in-right" style={{ fontSize: '1.5rem' }}></i>
              </Nav.Link>
              <Nav.Link href="/register" className="p-2">
                <i className="bi bi-person-plus" style={{ fontSize: '1.5rem' }}></i>
              </Nav.Link>
            </>
          )}
        </Nav>
      </div>

      <Offcanvas show={show} onHide={handleClose} placement="start" className="custom-sidebar w-25">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Welcome, {username || 'Guest'}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
          {isAuthenticated && userId ? (
            <>
              <Nav.Link href={`/profile/${userId}`} className="mb-1">
                <i className="bi bi-person" style={{ fontSize: '1.5rem' }}></i> Profile
              </Nav.Link>
                <Nav.Link href="/reading-list" className='mb-1' onClick={handleClose}>
                  <i className="bi bi-book" style={{ fontSize: '1.5rem' }}></i> Reading List
                </Nav.Link>
                <Nav.Link href="/your-stories" className='mb-1' onClick={handleClose}>
                  <i className="bi bi-file-earmark-text" style={{ fontSize: '1.5rem' }}></i> Your Stories
                </Nav.Link>
                <Nav.Link href="/create-story" className='mb-1' onClick={handleClose}>
                  <i className="bi bi-pencil" style={{ fontSize: '1.5rem' }}></i> Create Story
                </Nav.Link>
                <Nav.Item>
                  <hr className="divider" />
                </Nav.Item>
                <Nav.Link href="/settings" className='mb-1' onClick={handleClose}>
                  <i className="bi bi-gear" style={{ fontSize: '1.5rem' }}></i> Settings
                </Nav.Link>
                <Logout />
              </>
            ) : (
              <>
                <Nav.Link href="/login" className='mb-1' onClick={handleClose}>
                  <i className="bi bi-box-arrow-in-right" style={{ fontSize: '1.5rem' }}></i> Login
                </Nav.Link>
                <Nav.Link href="/register" className='mb-1' onClick={handleClose}>
                  <i className="bi bi-person-plus" style={{ fontSize: '1.5rem' }}></i> Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Sidebar;
