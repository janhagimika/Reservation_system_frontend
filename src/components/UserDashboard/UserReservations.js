import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import axiosConfig from '..//..//axios';

const UserReservations = forwardRef((props, ref) => {
    const [reservations, setReservations] = useState([]);
    const [reservationStatusChanged, setReservationStatusChanged] = useState(false);
    const [reservationClasses, setReservationClasses] = useState({});


    // Expose the fetchReservations function to the parent component
    useImperativeHandle(ref, () => ({
        fetchReservations
    }));

    const fetchReservations = async () => {
        const userId = localStorage.getItem('userId'); // Get userId from localStorage
        try {
            const response = await axiosConfig.get(`reservations/${userId}`);
            setReservations(response.data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleCancelReservation = async (reservationId) => {
        try {
            const response = await axiosConfig.delete(`reservations/${reservationId}`);
            if (response.status === 200) {
                setReservations(reservations.filter(r => r.id !== reservationId));
                alert('Rezervace byla zrušena.');
            } else {
                alert('Nepodařilo se zrušit rezervaci.');
            }
        } catch (error) {
            console.error('Error canceling reservation:', error);
        }
    };

    const getReservationClass = (startTime, endTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (end < now) {
            return 'past-reservation';
        } else if (start <= now && end >= now) {
            return 'present-reservation';
        } else {
            return 'future-reservation';
        }
    };

    useEffect(() => {
        //reload update
        const updatedClasses = {};
        reservations.forEach((reservation) => {
            const reservationClass = getReservationClass(reservation.startTime, reservation.endTime);
            updatedClasses[reservation.id] = reservationClass;
        });

        //update in interval
        setReservationClasses(updatedClasses);
        const interval = setInterval(() => {
            const updatedClasses = {};
            reservations.forEach((reservation) => {
                const reservationClass = getReservationClass(reservation.startTime, reservation.endTime);
                updatedClasses[reservation.id] = reservationClass;
            });
            setReservationClasses(updatedClasses);
        }, 10000); // Nastavíme interval na 60 sekund, aby se zbytečně nevolal každou sekundu

        return () => clearInterval(interval); // Zajistíme, že interval bude odstraněn při unmountu komponenty
    }, [reservations]);
          
    return (
        <div>
            <h2>Moje Rezervace</h2>
    
            <div className="legend-container">
                <div className="legend-item">
                    <span className="legend-box past-reservation"></span> Minulá rezervace
                </div>
                <div className="legend-item">
                    <span className="legend-box present-reservation"></span> Současná rezervace
                </div>
                <div className="legend-item">
                    <span className="legend-box future-reservation"></span> Budoucí rezervace
                </div>
            </div>
    
            <div className="reservations-list">
                {reservations.map(reservation => {
                    const now = new Date();
                    const startTime = new Date(reservation.startTime);
                    const endTime = new Date(reservation.endTime);
                    
                    // Určíme, zda je rezervace minulá, současná nebo budoucí
                    let reservationClass = '';
                    if (endTime < now) {
                        reservationClass = 'past-reservation';  // Minulá rezervace
                    } else if (startTime <= now && endTime >= now) {
                        reservationClass = 'present-reservation';  // Probíhající rezervace
                    } else {
                        reservationClass = 'future-reservation';  // Budoucí rezervace
                    }
    
                    return (
                        <div
                            key={reservation.id}
                            className={`reservation-card ${reservationClasses[reservation.id]}`}>
                            <h3>{reservation.service.serviceName}</h3>
                            <p><strong>Od:</strong> {new Date(reservation.startTime).toLocaleString()}</p>
                            <p><strong>Do:</strong> {new Date(reservation.endTime).toLocaleString()}</p>
                            
                            {/* Tlačítko pro zrušení bude pouze u budoucích rezervací */}
                            {reservationClass === 'future-reservation' && (
                                <button className="cancel-button" onClick={() => handleCancelReservation(reservation.id)}>
                                    Zrušit rezervaci
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );    
});

export default UserReservations;