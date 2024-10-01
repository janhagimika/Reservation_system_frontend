import React, { useState, useEffect } from 'react';
import axiosConfig from '../../axios'; // Importing the axios configuration
import '../../styles/App.css'; // Assuming you have some CSS for styling


function ManageReservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get('/reservations');
            const reservationData = await response.data;
            setReservations(reservationData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            setLoading(false);
        }
    };

    const handleCancel = async (reservationId) => {
        if (window.confirm("Jste si jisti že chcete tuto rezervaci zrušit?")) {
            try {
                await axiosConfig.delete(`/reservations/${reservationId}`);
                alert("Rezervace zrušena úspěšně.");
                fetchReservations(); // Refresh the list after deletion
            } catch (error) {
                console.error('Chyba při rušení rezervace:', error);
                alert("Chyba při rušení rezervace.");
            }
        }
    };

    return (
        <div>
            <h2>Správa Rezervací</h2>
            {loading ? (
                <p>Načítání rezervací...</p>
            ) : (
                <div className="reservationTableContainer">
                    <table>
                        <thead>
                            <tr>
                                <th>ID rezervace</th>
                                <th>Uživatel</th>
                                <th>Služba</th>
                                <th>Čas začátku</th>
                                <th>Čas konce</th>
                                <th>Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map(({ reservation, commodity }) => (
                                <tr key={reservation.id}>
                                    <td>{reservation.id}</td>
                                    <td>
                                        <strong>Jméno:</strong> {reservation.user.firstName} {reservation.user.surname} <br />
                                        <strong>Email:</strong> {reservation.user.email} <br />
                                        <strong>Telefon:</strong> {reservation.user.phoneNumber} <br />
                                        <strong>Uživatelské jméno:</strong> {reservation.user.username} <br />
                                    </td>
                                    <td>
                                    {commodity && commodity.service && (
                                        <div>
                                        <strong>Komodita:</strong> {commodity.service.serviceName}<br />
                                        <strong>Kapacita:</strong> {commodity.capacity || commodity.service.capacity}<br />
                                        {commodity.pricePerNight && (
                                            <>
                                            <strong>Cena za noc:</strong> {commodity.pricePerNight}<br />
                                            </>
                                        )}
                                        {commodity.cuisineType && (
                                            <>
                                            <strong>Typ kuchyně:</strong> {commodity.cuisineType}<br />
                                            </>
                                        )}
                                        {commodity.location && (
                                            <>
                                            <strong>Umístění:</strong> {commodity.location}<br />
                                            </>
                                        )}
                                        {commodity.status && (
                                            <>
                                            <strong>Stav:</strong> {commodity.status}<br />
                                            </>
                                        )}
                                        </div>
                                    )}
                                    </td>
                                    <td>{new Date(reservation.startTime).toLocaleString()}</td>
                                    <td>{new Date(reservation.endTime).toLocaleString()}</td>
                                    <td>
                                        <button onClick={() => handleCancel(reservation.id)}>Zrušit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ManageReservations;
