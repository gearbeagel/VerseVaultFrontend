import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext'; 
import { getCsrfTokenFromCookie } from '../misc/Api';

function Settings() {
  const { userId, isAuthenticated } = useAuth(); // Use userId and isAuthenticated
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    location: '',
    icon_name: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return; // Ensure userId is available

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user-auth/profile/${userId}/`, {
          withCredentials: true,
        });
        const { user, bio, location, icon_name } = response.data;

        setFormData({
          username: user.username,
          email: user.email,
          bio: bio || '',
          location: location || '',
          icon_name: icon_name || '',
        });
      } catch (err) {
        console.error('Error fetching profile', err);
        setError('Failed to load profile');
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfileUpdate = async () => {
    try {
      const csrfToken = getCsrfTokenFromCookie("csrftoken");
      await axios.put(`http://localhost:8000/user-auth/profile/${userId}/`, {
        bio: formData.bio,
        location: formData.location,
        icon_name: formData.icon_name,
      }, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
      });
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile', err.response ? err.response.data : err.message);
      toast.error('Failed to update profile');
    }
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault();  // Make sure to prevent the default form submission
    handleProfileUpdate();  // Call the update function
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center mx-auto">
        <div className="col-sm-6">
          <div className="card shadow-lg rounded">
            <h2 className="card-title">Edit Profile</h2>
            <form onSubmit={handleSubmitProfile}>  {/* Bind handleSubmitProfile to the form */}
              <div className='card-body'>
                <div className="form-group">
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bio">Bio:</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location:</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="icon_name">Icon:</label>
                  <select
                    id="icon_name"
                    name="icon_name"
                    value={formData.icon_name}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select an icon</option>
                    <option value="fa-cat">Cat</option>
                    <option value="fa-dog">Dog</option>
                    <option value="fa-frog">Frog</option>
                    <option value="fa-crow">Crow</option>
                  </select>
                </div>
              </div>
              <div className='card-footer mt-3 text-center'>
                <button type="submit" className="btn btn-sw text-center mt-3 w-75">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Settings;
