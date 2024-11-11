import React, { useEffect, useState } from 'react';
import axiosConfig from '..//..//axios';
import '../../styles/App.css'; // Assuming you have some CSS for styling

function StatisticsReports() {
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get('reservations/statistics');
            const data = response.data;
            setStatistics(data);
        } catch (error) {
            console.error('Chyba při načítání statistik:', error);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div>
            <h2>Statistiky a reporty</h2>
            {loading ? (
                <p>Načítání statistik...</p>
            ) : (
                <div className='statisticsTableContainer'>
                    <table className="statistics-table">
                        <thead>
                            <tr>
                                <th>Uživatel</th>
                                <th>Celkový počet rezervací</th>
                                <th>Nejčastěji rezervovaná komodita</th>
                                <th>Rezervace v minulosti</th>
                                <th>Aktivní rezervace</th>
                                <th>Budoucí rezervace</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statistics.map((stat, index) => (
                                <tr key={index}>
                                    <td><strong>Jméno a příjmení:</strong>{stat.user.firstName} {stat.user.surname} <br/> <strong>Email:</strong>{stat.user.email}</td>
                                    <td>{stat.totalReservations}</td>
                                    <td>{stat.mostReservedCommodity}</td>
                                    <td>{stat.passedReservations}</td>
                                    <td>{stat.activeReservations}</td>
                                    <td>{stat.futureReservations}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default StatisticsReports;
