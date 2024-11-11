import React from 'react';
import ManageUsers from './ManageUsers';
import CommoditiesControl from './CommoditiesControl';
import ManageReservations from '../ManagerDashboard/ManageReservations';
import SystemSettings from './SystemSettings';
import LogoutButton from '../LogoutButton';
import '../../styles/App.css'; // Assuming you have some CSS for styling

function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            <h1>Vítejte na administračním dashboardu</h1>
            <div className="dashboard-container">
            <LogoutButton />{}
                <div className="dashboard-section">
                    <ManageUsers />
                </div>
                <div className="dashboard-section">
                    <CommoditiesControl />
                </div>
                <div className="dashboard-section">
                    {/* Reuse manažerskou komponentu pro správu rezervací */}
                    <ManageReservations />
                </div>
                <div className="dashboard-section">
                    <SystemSettings />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
