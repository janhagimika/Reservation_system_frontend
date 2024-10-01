import React, { useRef } from 'react';
import UserReservations from './UserReservations';
import AvailableCommodities from './AvailableCommodities';
import UserProfile from './UserProfile';
import LogoutButton from '..//LogoutButton'
import '../../styles/App.css';

function UserDashboard() {
    const reservationsRef = useRef();

    // Function to refresh reservations from AvailableCommodities
    const refreshReservations = () => {
        if (reservationsRef.current) {
            reservationsRef.current.fetchReservations(); // Call the fetchReservations function in UserReservations
        }
    };

    return (
        <div className="user-dashboard">
            <h1>Vítejte na uživatelském dashboardu</h1>
            <LogoutButton />{}
            <div className="dashboard-section">
            <AvailableCommodities refreshReservations={refreshReservations} />
            </div>
            <div className="dashboard-section">
                <UserReservations ref={reservationsRef} />
            </div>
            <div className="dashboard-section">
                <UserProfile />
            </div>
        </div>
    );
}

export default UserDashboard;
