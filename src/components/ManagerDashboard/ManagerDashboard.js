import React from 'react';
import ManageReservations from './ManageReservations';
import CommoditiesControl from '../AdminDashboard/CommoditiesControl'
import LogoutButton from '../LogoutButton';
import StatisticsReports from './StatisticsReports';
import '../../styles/App.css';

function ManagerDashboard() {
    return (
        <div className="manager-dashboard">
            <h1>Vítejte na manažerském dashboardu</h1>
            <LogoutButton />{}
            <div className="dashboard-section">
                <ManageReservations />
            </div>
            <div className="dashboard-section">
                <CommoditiesControl />
            </div>
            <div className="dashboard-section">
                <StatisticsReports />

            </div>
        </div>
    );
}

export default ManagerDashboard;
