import React, { useState } from 'react';
import AuthService from '../services/AuthService';
import '../assets/css/login.css';

const RegisterPage = () => {
  const [user, setUser] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Thêm trạng thái cho thông báo thành công

  const handleChange = (e) => {
      const { name, value } = e.target;
      setUser(prevState => ({
          ...prevState,
          [name]: value
      }));
      // Xóa thông điệp lỗi và thành công khi người dùng bắt đầu sửa form
      setErrorMessage('');
      setSuccessMessage('');
  }

  const handleSubmit = (e) => {
      e.preventDefault();
      // Kiểm tra xem password và confirmPassword có khớp nhau không
      if (user.password !== user.confirmPassword) {
          setErrorMessage('Passwords do not match.');
          return;
      }

      AuthService.register(user.firstName, user.lastName, user.email, user.password)
          .then(response => {
              // Thông báo đăng ký thành công
              setSuccessMessage('Registration successful!');
              setErrorMessage('');
          })
          .catch(error => {
              // Phản hồi từ server có thể chứa thông tin lỗi cụ thể
              if (error.response && error.response.data) {
                  // Giả sử server trả về thông điệp lỗi trong error.response.data.message
                  setErrorMessage(error.response.data.message || 'Email already exists !');
                  setSuccessMessage('');
              } else {
                  setErrorMessage('Email already exists. Please use another email.');
                  setSuccessMessage('');
                  console.error('Something went wrong!', error);
              }
          });
  }

    return (
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Register</h2>
{errorMessage && <div className="error-message">{errorMessage}</div>}
{successMessage && <div className="success-message" style={{color:'green'}}>{successMessage}</div>}
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={user.confirmPassword} // Cập nhật để lấy giá trị từ state
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Register</button>
          <div style={{textAlign:'center', color:'white'}}>or</div>
      <button style={{ backgroundColor: 'gray', color: 'white', cursor: 'pointer' }}
      onClick={() => window.location.href='/login'}>
      Login
      </button>
        </form>
      </div>
    );
  };

export default RegisterPage;
