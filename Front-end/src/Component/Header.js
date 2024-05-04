import React, { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';
import ChatBox from './ChatBox';
const clientId = '896387674450-36c0ktb6qabai36ol9271dlh2u1at97k.apps.googleusercontent.com';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user'); 
        setIsLoggedIn(!!user);
    }, []);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            navigate('/login', { state: { successMessage: 'Logout success !' } });
            localStorage.removeItem('user');
            localStorage.removeItem('Authorization');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // CSS cho dropdown list
    const dropdownStyle = {
        display: isMenuOpen ? 'block' : 'none'
    };

    return (
        <header className="header-area header-sticky">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <nav className="main-nav">
                            <a className='menu-trigger' onClick={toggleMenu}>
                                <span>Menu</span>
                            </a>
                            {isLoggedIn ? (
                                <a href="/member" className="logo">
                                    GW <em>Fitness</em>
                                </a>
                            ) : (
                                <a href="/" className="logo">
                                    GW <em>Fitness</em>
                                </a>
                            )}

                            <ul className="nav" style={dropdownStyle}>
                                {isLoggedIn ? (
                                    <li className="scroll-to-section"><a href="/member" className="active">Home</a></li>
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
                                <li className="scroll-to-section">
                                    {isLoggedIn ? (
                                        <GoogleLogout
                                            clientId={clientId}
                                            buttonText="Logout"
                                            onLogoutSuccess={handleLogout}
                                            render={renderProps => (
                                                <a onClick={renderProps.onClick} disabled={renderProps.disabled} className="google-logout-btn ml-auto">
                                                    Logout
                                                </a>
                                            )}
                                        />
                                    ) : (
                                        <a href="/registration" className="main-button">Sign Up</a>
                                    )}
                                </li>
                            </ul>

                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
