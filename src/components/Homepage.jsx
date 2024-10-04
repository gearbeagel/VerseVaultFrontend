import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import axios from "axios";

const Homepage = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastFavoritedWork, setLastFavoritedWork] = useState(null);
  const isAuthenticated = true;

  const breakpointColumnsObj = {
    default: 2,
    1100: 2,
    700: 1,
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/misc/current_user/",
          {
            withCredentials: true,
          }
        );
        if (response.status === 200 && response.data.id) {
          const { username } = response.data;
          setUsername(username);
        } else {
          setUsername("Guest");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUsername("Guest");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUser();
    } else {
      setUsername("Guest");
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchLastFavoritedWork = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/user-auth/favs/",
          {
            withCredentials: true,
          }
        );
        if (response.status === 200 && response.data.length > 0) {
          // Access the first item in the array
          setLastFavoritedWork(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching last favorited work:", error);
      }
    };

    if (isAuthenticated) {
      fetchLastFavoritedWork();
    }
  }, [isAuthenticated]);

  return (
    <div
      className="container mt-5"
      style={{ maxWidth: "1600px", margin: "auto auto" }}
    >
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        <div className="card p-5 mb-2 mx-3 h-auto w-100 greeting-card">
          <h2>Hello, {username}.</h2>
          <h6>Welcome!</h6>
        </div>
        <div className="card mb-2 mx-3 w-100 p-5">
          <h6>Last liked work</h6>
          {lastFavoritedWork ? (
            <>
              <div className="card-body">
                <h3>
                  {" "}
                  <i className="bi bi-heart-fill"></i>{" "}
                  <a
                    href={`/story/${lastFavoritedWork.work.id}`}
                    className="text-decoration-none"
                    style={{ color: "var(--text-color)" }}
                  >
                    {lastFavoritedWork.work.title}
                  </a>
                </h3>
              </div>
              <div className="card-footer">
                <h4>{lastFavoritedWork.work.summary}</h4>
              </div>
            </>
          ) : (
            <p>No favorited works available.</p>
          )}
        </div>
        <div className="card mb-2 mx-3 w-100 p-5">
          <p>Card 3</p>
        </div>
        <div className="card mb-2 mx-3 w-100 p-5">
          <p>Card 4</p>
        </div>
        <div className="card mb-2 mx-3 w-100 p-5 ">
          <p>Card 5</p>
        </div>
      </Masonry>
    </div>
  );
};

export default Homepage;
