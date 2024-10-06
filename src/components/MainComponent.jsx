import React, { useState } from 'react';
import { Navbar, Nav, Form, FormControl, Container, Button, Dropdown } from 'react-bootstrap';
import Sidebar from './Sidebar';
import ThemeSwitcher from './ThemeSwitcher';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom'; // Import Link for navigation
import 'bootstrap-icons/font/bootstrap-icons.css';

const HeaderWithSidebar = ({ isAuthenticated }) => {
  const { userId } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebarClose = () => setShowSidebar(false);
  const handleSidebarShow = () => setShowSidebar(true);

  const handleSearch = (e) => {
    e.preventDefault();
    toast.success('Search triggered!');
  };

  return (
    <>
      <Navbar expand="lg" className='sticky-top'>
        <Container>
          <Button variant="link" onClick={handleSidebarShow} className="d-md-none">
            <i className="bi bi-arrow-right-square" style={{ fontSize: '2rem', color: `var(--text-color)` }}></i>
          </Button>
          <Navbar.Brand href="/">VerseVault</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className='btn-sw' />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Form className="d-flex align-items-center position-relative" onSubmit={handleSearch}>
                <FormControl
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  className="search-input"
                />
                <Button
                  variant="link"
                  className="search-button"
                  type="submit"
                >
                  <i className="bi bi-search"></i>
                </Button>
              </Form>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Navbar expand="lg" className='bg-sw-2' style={{ height: '35px', margin: '0 auto' }}>
        <Container>
          <Nav className="ms-auto">
            <Link to="/all-stories" className="nav-link badge btn-sw">
              <i className='bi bi-book'></i> Latest Stories
            </Link>
          </Nav>
          <ThemeSwitcher />
        </Container>
      </Navbar>

      <Sidebar
        isAuthenticated={isAuthenticated}
        show={showSidebar}
        handleClose={handleSidebarClose}
        handleShow={handleSidebarShow}
      />

      <ToastContainer />
    </>
  );
};

export default HeaderWithSidebar;
