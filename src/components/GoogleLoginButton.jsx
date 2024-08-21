import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = async (response) => {
    try {
      const id_token = response.credential;

      const backendResponse = await fetch('http://localhost:8000/user-auth/google_login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: id_token }),
        credentials: 'include',
      });

      const data = await backendResponse.json();

      if (backendResponse.ok) {
        navigate('/');
        window.location.reload();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLoginFailure = (error) => {
    console.error('Google login failed:', error);
  };

  return (
    <div className='d-flex justify-content-center mt-2'>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
      />
    </div>
  );
};

export default GoogleLoginButton;
