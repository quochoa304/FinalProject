import React, { useState } from 'react';
import '../assets/css/login.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  // Di chuyển khai báo useState vào đây
  const [errorMessage, setErrorMessage] = useState('');

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
        window.location.href = '/member';
      } else {
        // Xử lý đăng nhập thất bại
        console.error('Login failed');
        const errorData = await response.json();
        console.error('Login failed:', errorData.error);
        setErrorMessage(errorData.error || 'An unknown error occurred');
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  };




  
  return (
    <div className="login-container">
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
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
    </form>
  </div>
);
};

export default LoginPage;
export { LoginPage };