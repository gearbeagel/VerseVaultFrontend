import React from 'react';
import { Navbar, Nav, Form, FormControl, Container, Button } from 'react-bootstrap';
import ThemeSwitcher from './ThemeSwitcher';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {toast, ToastContainer} from 'react-toastify';

const AppNavbar = () => {
  const handleSearch = () => {
    toast.success('Search triggered!');
  };

  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand href="/">VerseVault</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Form className="d-flex align-items-center position-relative">
              <FormControl
                type="search"
                placeholder="Search"
                aria-label="Search"
                className="search-input"
              />
              <Button
                variant="link"
                className="search-button"
                onClick={handleSearch}
              >
                <i className="bi bi-search"></i>
              </Button>
            </Form>
            <ThemeSwitcher />
          </Nav>
        </Navbar.Collapse>
      </Container>
      <ToastContainer/>
    </Navbar>
  );
};

export default AppNavbar;
