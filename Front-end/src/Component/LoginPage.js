import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setMessage] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleId, setGoogleId] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('upgradeMembership');
  if (location.state && location.state.errorMessage) {
    setErrorMessage(location.state.errorMessage);
  } else {
    // Nếu không có thông điệp lỗi từ trang trước, kiểm tra URL parameters
    const searchParams = new URLSearchParams(location.search);
    const errorMessageParam = searchParams.get('errorMessage');
    if (errorMessageParam) {
      setErrorMessage(errorMessageParam);
    }
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
  
    // Kiểm tra xem email có phải là "admin@gmail.com" không
   
      try {
          const response = await fetch('http://localhost:8000/authenticate', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, password })
          });
          console.log('Server response:', response.headers); // Log the full response
          
          if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
              throw new Error('Login failed');
          }
  
          const data = await response.json();
     
          localStorage.setItem('Authorization','Bearer '+ data.token);
  
          localStorage.setItem('user', 'true');
          if(username === 'admin@gmail.com'){
            localStorage.setItem('role', 'admin');
            navigate("/admin");
          } else {
          console.log('Login successful:', data.token);
          localStorage.setItem('role', 'user');
          // window.location.href = '/profile';
          navigate("/member");
          }
          // Redirect to the main page or the requested page
          

      } catch (error) {
          console.error('Login error:', error);
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
      try {
        console.log(googleEmail, googleId);
          const response = await fetch('http://localhost:8000/authenticate', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                username: googleData.profileObj.email, 
                password: googleData.profileObj.googleId 
              })
          });
          console.log('Server response:', response.headers); // Log the full response
          
          if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
              throw new Error('Login failed');
              
          }
  
          const data = await response.json();
     
          localStorage.setItem('Authorization','Bearer '+ data.token);
  
          localStorage.setItem('user', 'true');
          navigate("/member");
  
          // Redirect to the main page or the requested page
          
          console.log('Login successful:', data.token);
        } catch (error) {
          console.error('Login error:', error);
          setErrorMessage('');
          setMessage('Press "Login" to continue.');
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
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
