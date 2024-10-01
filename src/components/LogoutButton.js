import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css'

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the token and role from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        // Redirect to the login page
        navigate('/login');
    };

    return (
        <div className="logout-container">
            <button className="logout-button" onClick={handleLogout}>
                Odhlásit se
            </button>
        </div>
    );
}

export default LogoutButton;
