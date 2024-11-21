import React, { useState, useEffect } from 'react';
import axiosConfig from '../../axios'; // Importing the axios configuration
import '../../styles/App.css'; // Assuming you have some CSS for styling


function ManageReservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState(""); // State for name filter
    const [searchDate, setSearchDate] = useState(""); // State for date filter

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

    const searchByName = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get('/reservations/searchByName', {
                params: { name: searchName }, // Value from the input field
            });
            setReservations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error searching reservations by name:', error);
            setLoading(false);
        }
    };
    
    const searchByDate = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get('/reservations/searchByDate', {
                params: { date: searchDate }, // Value from the date picker
            });
            setReservations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error searching reservations by date:', error);
            setLoading(false);
        }
    };

    const clearSearch = async () => {
        setSearchName("");
        setSearchDate("");
        await fetchReservations();
    };
    
    

    return (
        <div>
            <h2>Správa Rezervací</h2>
            {loading ? (
                <p>Načítání rezervací...</p>
            ) : (
                <div className="reservationTableContainer">
                    <div className="searchContainer">
                        <div className="searchField">
                            <label>Hledat podle jména:</label>
                            <input
                                type="text"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                placeholder="Zadejte jméno"
                            />
                            <button onClick={searchByName}>Hledat podle jména</button>
                        </div>
                        <div className="searchField">
                            <label>Hledat podle data:</label>
                            <input
                                type="date"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                            />
                            <button onClick={searchByDate}>Hledat podle data</button>
                        </div>
                        <button className="clearButton" onClick={clearSearch}>
                            Zobrazit všechny rezervace
                        </button>
                    </div>

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
                            {reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td>{reservation.id}</td>
                                    <td>
                                        <strong>Jméno:</strong> {reservation.user.firstName} {reservation.user.surname} <br />
                                        <strong>Email:</strong> {reservation.user.email} <br />
                                        <strong>Telefon:</strong> {reservation.user.phoneNumber} <br />
                                        <strong>Uživatelské jméno:</strong> {reservation.user.username}
                                    </td>
                                    <td>
                                        <strong>Název služby:</strong> {reservation.service.serviceName} <br />
                                        {reservation.service.cuisineType && (
                                            <>
                                                <strong>Typ kuchyně:</strong> {reservation.service.cuisineType} <br />
                                            </>
                                        )}
                                        {reservation.service.location && (
                                            <>
                                                <strong>Umístění:</strong> {reservation.service.location} <br />
                                            </>
                                        )}
                                        {reservation.service.type && (
                                            <>
                                                <strong>Typ:</strong> {reservation.service.type} <br />
                                            </>
                                        )}
                                        {reservation.service.pricePerNight && (
                                            <>
                                                <strong>Cena za noc:</strong> {reservation.service.pricePerNight} <br />
                                            </>
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
