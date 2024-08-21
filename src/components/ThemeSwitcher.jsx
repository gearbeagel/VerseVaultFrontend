import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    const handleSelect = (selectedTheme) => {
        toggleTheme(selectedTheme); 
    };

    return (
        <Dropdown className="mx-3">
            <Dropdown.Toggle variant="link" id="theme-dropdown" className="btn theme-switcher">
                {theme === 'light' && <i className="bi bi-sun"></i>}
                {theme === 'dark' && <i className="bi bi-moon"></i>}
                {theme === 'dim' && <i className="bi bi-stars"></i>}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleSelect('light')}>
                    <i className="bi bi-sun"></i> Light
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelect('dark')}>
                    <i className="bi bi-moon"></i> Dark
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelect('dim')}>
                    <i className="bi bi-stars"></i> Dim
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ThemeSwitcher;
