import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Homepage from "./components/Homepage";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import HeaderWithSidebar from "./components/MainComponent";
import ThemeProvider from "./context/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { checkUserAuth } from "./misc/Api";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import WorkCreate from "./components/WorkCreate";
import YourWorks from "./components/WorkListWriters";
import EditChapter from "./components/EditChapter";
import WorkDetail from "./components/ViewWork";
import ViewChapter from "./components/ViewChapter";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import AllWorks from "./components/WorkListAll";
import AllBookmarks from "./components/ReadingList";

function GlobalLoadingSpinner() {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="global-spinner text-center mt-5">
      <div className="spinner"></div>
    </div>
  );
}

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
      <LoadingProvider>
        <AuthProvider>
          <ThemeProvider>
            <Router>
              <HeaderWithSidebar isAuthenticated={isAuthenticated} />
              <GlobalLoadingSpinner />
              <Routes>
                <Route path="/" element={<Homepage />} />
                {!isAuthenticated && (
                  <Route path="/login" element={<Login />} />
                )}
                {!isAuthenticated && (
                  <Route path="/register" element={<Register />} />
                )}
                {isAuthenticated && (
                  <Route path="/logout" element={<Logout />} />
                )}
                {isAuthenticated && (
                  <Route path="/profile/:id" element={<Profile />} />
                )}
                {isAuthenticated && (
                  <Route path="/settings" element={<Settings />} />
                )}
                {isAuthenticated && (
                  <>
                    <Route path="/create-story" element={<WorkCreate />} />
                    <Route path="/edit-story/:workId" element={<WorkCreate />} />
                  </>
                )}
                {isAuthenticated && (
                  <>
                    <Route
                      path="/chapter-detail/:id"
                      element={<EditChapter />}
                    />
                    <Route
                      path="/chapter-detail/new/:workId"
                      element={<EditChapter />}
                    />
                  </>
                )}
                {isAuthenticated && (
                  <Route path="/your-stories" element={<YourWorks />} />
                )}
                {isAuthenticated && (
                  <Route path="/story/:id" element={<WorkDetail />} />
                )}
                {isAuthenticated && (
                  <Route path="/chapters/:id" element={<ViewChapter />} />
                )}
                {isAuthenticated && (
                    <Route path="/all-stories" element={<AllWorks />} />
                  )}
                {isAuthenticated && (
                    <Route path="/reading-list" element={<AllBookmarks />} />
                  )}
              </Routes>
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </LoadingProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
