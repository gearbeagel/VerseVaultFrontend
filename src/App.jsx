import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Homepage from "./components/Homepage";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Sidebar from "./components/Sidebar";
import AppNavbar from "./components/Navbar";
import ThemeProvider from "./context/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { checkUserAuth } from "./misc/Api";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import WorkCreate from "./components/WorkCreate";
import YourWorks from "./components/WorkListWriters";
import EditChapter from "./components/EditChapter";

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
              {!isAuthenticated && (
                <Route path="/register" element={<Register />} />
              )}
              {isAuthenticated && <Route path="/logout" element={<Logout />} />}
              {isAuthenticated && (
                <Route path="/profile/:id" element={<Profile />} />
              )}
              {isAuthenticated && (
                <Route path="/settings" element={<Settings />} />
              )}
              {isAuthenticated && (
                <Route path="/create-story" element={<WorkCreate />} />
              )}
              {isAuthenticated && (
                <Route path="/chapter-detail/:id" element={<EditChapter/>}/>
              )}
              {isAuthenticated && (
                <Route path="/your-stories" element={<YourWorks />} />
              )}
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
