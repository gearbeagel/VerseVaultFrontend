import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCat,
  faDog,
  faFrog,
  faCrow,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const iconMap = {
    "fa-cat": faCat,
    "fa-dog": faDog,
    "fa-frog": faFrog,
    "fa-crow": faCrow,
    "fa-user": faUser,
  };

  const { id } = useParams(); // Get the user ID from the URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user-auth/profile/${id}/`,
          {
            withCredentials: true,
          }
        );
        const { user, bio, location, icon_name, user_type } = response.data;

        setProfile({
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          bio: bio || "",
          location: location || "",
          icon_name: icon_name || "fa-user",
          user_type: user_type || "Unknown",
        });
      } catch (err) {
        console.error("Error fetching user profile", err);
        setError("Failed to load profile");
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const icon = profile ? iconMap[profile.icon_name] || faUser : faUser;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        {/* Profile Card */}
        <div className="col-4 mb-4">
          <div className="card profile-card shadow-lg rounded p-4">
            <div className="card-body">
              <div className="text-center">
                <FontAwesomeIcon icon={icon} size="5x" />
                <div className="d-flex align-items-center justify-content-center mt-3">
                  <h2 className="mb-0 me-2">{profile.username}</h2>
                  {profile.user_type === "WRITER" ? (
                    <i
                      className="bi bi-pencil"
                      style={{ fontSize: "1rem" }}
                    ></i>
                  ) : (
                    <i className="bi bi-book" style={{ fontSize: "1rem" }}></i>
                  )}
                </div>
                <h6 className="mt-1">
                  {profile.first_name} {profile.last_name}
                </h6>
                <hr />
                <div className="text-start">
                  {profile.bio && (
                    <p>
                      <strong>
                        <i className="bi bi-file-text"></i>
                      </strong>{" "}
                      {profile.bio}
                    </p>
                  )}
                  {profile.location && (
                    <p>
                      <strong>
                        <i className="bi bi-geo-alt-fill"></i>
                      </strong>{" "}
                      {profile.location}
                    </p>
                  )}
                  <p>
                    <strong>
                      <i className="bi bi-envelope"></i>
                    </strong>{" "}
                    <span>
                      <a
                        style={{ color: "var(--text-color)" }}
                        href={`mailto:${profile.email}`}
                      >
                        {profile.email}
                      </a>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="col-6">
          {profile.user_type === "WRITER" && (
            <div className="card stats-card shadow-lg rounded p-4 mb-4">
              <div className="card-body">
                <h5>Writer Stats</h5>
                <hr />
                {/* Add writer-specific stats here */}
              </div>
            </div>
          )}

          <div
            className={`card stats-card shadow-lg rounded p-4 ${
              profile.user_type === "WRITER" ? "" : "mb-4"
            }`}
          >
            <div className="card-body">
              <h5>Reader Stats</h5>
              <hr />
              {/* Add reader-specific stats here */}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Profile;

