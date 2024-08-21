import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import Logout from './components/Logout';
import Homepage from './components/Homepage';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Sidebar from './components/Sidebar';
import AppNavbar from './components/Navbar';
import ThemeProvider from './context/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { checkUserAuth } from './misc/Api'; 
import { AuthProvider } from './context/AuthContext';
import Register from './components/Register';
import Profile from "./components/Profile";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      const authStatus = await checkUserAuth();
      setIsAuthenticated(authStatus);
    };

    fetchAuthStatus();
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppNavbar />
          <Sidebar isAuthenticated={isAuthenticated} />
          <Routes>
            <Route path="/" element={<Homepage />} />
            {!isAuthenticated && <Route path="/login" element={<Login />} />}
            {!isAuthenticated && <Route path='/register' element={<Register/>} />}
            {isAuthenticated && <Route path='/logout' element={<Logout/>} />}
            {isAuthenticated && <Route path='/profile' element={<Profile/>} />}
          </Routes>
        </Router>
      </ThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
