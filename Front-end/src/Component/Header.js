
import React, { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { GoogleLogout, useGoogleLogout } from 'react-google-login';
const clientId = '896387674450-36c0ktb6qabai36ol9271dlh2u1at97k.apps.googleusercontent.com';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      const user = localStorage.getItem('user'); // Giả sử bạn lưu trạng thái đăng nhập ở đây
      console.log('user', user);
      setIsLoggedIn(!!user);
    }, []);
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
          await AuthService.logout();
          navigate('/login', { state: { successMessage: 'Logout success !' } });
          localStorage.removeItem('user');
        } catch (error) {
          console.error('Logout failed', error);
        }
      };
      
    return (
        <header className="header-area header-sticky">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                <a href="/" className="logo">
                  GW <em>Fitness</em>
                </a>
                <ul className="nav">
                {isLoggedIn ? (
                     <li className="scroll-to-section"><a href="/" className="active">Home</a></li>
                  ) : (
                    <li className="scroll-to-section"><a href="#top" className="active">Home</a></li>
                  )}
                  <li className="scroll-to-section"><a href="#features">About</a></li>
                  {isLoggedIn ? (
                    <li className="scroll-to-section"><a href="/classes">Our Classes</a></li>
                  ) : (
                    <li className="scroll-to-section"><a href="/#our-classes">Our Classes</a></li>
                  )}
                  {isLoggedIn ? (
                    <li className="scroll-to-section"><a href="/profile">Profile</a></li>
                  ) : (
                    <li className="scroll-to-section"><a href="#schedule">Schedule</a></li>
                  )}
                    
                    <li className="scroll-to-section"><a href="/caloCalculator">Calories Calculator</a></li>
                    <li className="scroll-to-section">{isLoggedIn ? (
                          <GoogleLogout
                          clientId={clientId}
                          buttonText="Logout"
                          onLogoutSuccess={handleLogout}
                          render={renderProps => (
                            <a onClick={renderProps.onClick} disabled={renderProps.disabled} className="google-logout-btn">
                              Logout
                            </a>
                          )}
                        />
      ) : (
        <a href="/registration" className="main-button">Sign Up</a>
      )}</li>
                    
                  {/* Thêm các mục menu khác tại đây */}
                </ul>
                <a className='menu-trigger'>
                  <span>Menu</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>
    );
};

export default Header;
