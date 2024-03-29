import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../assets/css/login.css';
import '../assets/css/loading.css';
import useLoading from '../hook/useLoading';
import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';
import AuthService from '../services/AuthService';

const clientId = '896387674450-36c0ktb6qabai36ol9271dlh2u1at97k.apps.googleusercontent.com';

function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.errorMessage) {
      setErrorMessage(location.state.errorMessage);
    }
    if (location.state && location.state.successMessage) {
      setMessage(location.state.successMessage);
    }
  }, [location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Login successful');
        localStorage.setItem('user', 'true');
        window.location.href = '/member';
      } else {
        console.error('Login failed');
        const errorData = await response.json();
        console.error('Login failed:', errorData.error);
        setErrorMessage(errorData.error || 'An unknown error occurred');
        setMessage('');
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const onSuccess = async (googleData) => {
    console.log('Login Success: currentUser:', googleData.profileObj.googleId);
    localStorage.setItem('user', 'true');

    try {
      const registrationResponse = await AuthService.registerFromGoogle(googleData);
      console.log('Registration Success:', registrationResponse);
      setMessage('Registration successful');
      setErrorMessage('');
    } catch (error) {
      const formData = new FormData();
      formData.append('username', googleData.profileObj.email);
      formData.append('password', googleData.profileObj.googleId);

      try {
        const response = await fetch('http://localhost:8080/login', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (response.ok) {
          console.log('Login successful');
          localStorage.setItem('user', 'true');
          window.location.href = '/member';
        } else {
          console.error('Login failed');
          const errorData = await response.json();
          console.error('Login failed:', errorData.error);
          setErrorMessage(errorData.error || 'An unknown error occurred');
          setMessage('');
        }
      } catch (error) {
        console.error('There was an error!', error);
      }
    }
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
  };

  return (
    <div className="login-container">
      {isLoading && (
        <div style={{ textAlign: 'center' }}>
          <i className="loading-icon fa fa-hourglass-half" aria-hidden="true"></i>
          <p>Loading...</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message" style={{ color: 'green' }}>{successMessage}</div>}
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
        <div style={{ textAlign: 'center', color: 'white' }}>or</div>
        <button
          style={{ backgroundColor: 'gray', color: 'white', cursor: 'pointer' }}
          onClick={() => window.location.href = '/registration'}
        >
          Register
        </button>
        <GoogleLogin
          clientId={clientId}
          buttonText="Login"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
      </form>
    </div>
  );
}

export default LoginPage;
