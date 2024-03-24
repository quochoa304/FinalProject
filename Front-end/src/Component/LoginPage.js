import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Thêm dòng này
import '../assets/css/login.css';
import '../assets/css/loading.css';
import useLoading from '../hook/useLoading';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const { isLoading, showLoading, hideLoading } = useLoading();

  const location = useLocation(); // Sử dụng hook useLocation

  // Di chuyển khai báo useState vào đây
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
    formData.append('username', credentials.email); // Giả sử back-end dùng 'username' và 'password'
    formData.append('password', credentials.password);
  
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        // 'Content-Type' không cần thiết khi sử dụng FormData với fetch, nó sẽ được set tự động
        body: formData,
        credentials: 'include', // Đối với xác thực dựa trên session
      });
  
      if (response.ok) {
        console.log('Login successful');
        // Xử lý đăng nhập thành công
        // Chuyển hướng tới trang chính
        localStorage.setItem('user', 'true');
        window.location.href = '/member';
      } else {
        // Xử lý đăng nhập thất bại
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




  
  return (
    <div className="login-container">
            {isLoading && (
        <div style={{ textAlign: 'center' }}>
        <i className="loading-icon fa fa-hourglass-half" aria-hidden="true"></i> {/* Giả sử bạn sử dụng Font Awesome */}
        <p>Loading...</p>
      </div>  
      )}
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message" style={{color:'green'}}>{successMessage}</div>}
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
      <div style={{textAlign:'center', color:'white'}}>or</div>
      <button style={{ backgroundColor: 'gray', color: 'white', cursor: 'pointer' }}
      onClick={() => window.location.href='/registration'}>
      Register
      </button>
    </form>
  </div>
);
};

export default LoginPage;
export { LoginPage };