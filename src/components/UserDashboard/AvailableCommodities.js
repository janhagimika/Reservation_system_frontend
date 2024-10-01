import React, { useState, useEffect, useRef } from 'react';
import '../../styles/App.css'; // Assuming you have the CSS set up
import DatePicker, { registerLocale } from 'react-datepicker'; // Přidán import registerLocale
import 'react-datepicker/dist/react-datepicker.css'; // Style for DatePicker
import { cs } from 'date-fns/locale'; // Import české lokalizace
import axiosConfig from '..//..//axios'; // Import the axios configuration


registerLocale('cs', cs);

function AvailableCommodities({ refreshReservations }) {    // Accept fetchReservations as a prop
    const [bars, setBars] = useState([]);
    const [lifts, setLifts] = useState([]);
    const [rooms, setRooms] = useState([]);

    // Přidáme stavy pro výběr času a komodity
    const [selectedCommodity, setSelectedCommodity] = useState(null);
    const [selectedStartTime, setSelectedStartTime] = useState(null);
    const [selectedEndTime, setSelectedEndTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null); // Add state for selected date
    const [availableTimes, setAvailableTimes] = useState([]);  // New state to store available times

    const reservationFormRef = useRef(null);

    useEffect(() => {
        // Fetching all commodities from the backend
        fetchCommodities();
    }, []);

    const fetchCommodities = async (types = ['bar', 'lift', 'room']) => {
        try {
            const promises = types.map((type) => {
                let endpoint = getEndpointByType(type);
                return axiosConfig.get(endpoint);
            });

            const responses = await Promise.all(promises);
            const data = await Promise.all(responses.map((response) => response.data));

            data.forEach((commodities, index) => {
                switch (types[index]) {
                    case 'bar':
                        setBars(commodities);
                        break;
                    case 'lift':
                        setLifts(commodities);
                        break;
                    case 'room':
                    default:
                        setRooms(commodities);
                        break;
                }
            });
        } catch (error) {
            console.error('Error fetching commodities:', error);
        }
    };

    const handleReservation = async (commodity, type) => {
        if (!selectedCommodity || !selectedStartTime || !selectedEndTime) {
            alert('Prosím vyberte komoditu a časy k rezervaci.');
            return;
        }

        const userId = parseInt(localStorage.getItem('userId'), 10); // Convert to integer
        const startTime = selectedStartTime.toISOString();
        const endTime = selectedEndTime.toISOString();
        // Call to backend API to create a reservation
        try {
            const response = await axiosConfig.post('/reservations', {
                service: {
                    serviceId: commodity.service.serviceId,
                    serviceName: commodity.service.serviceName
                },
                user: { id: userId },
                serviceType: type,
                startTime: startTime,
                endTime: endTime,
            });
            
            if (response.status === 200) {
                alert('Rezervace byla úspěšně vytvořena.');
                refreshReservations();
                setSelectedStartTime(null);
                setSelectedEndTime(null);
                setSelectedCommodity(null);
            } else {
                alert(`Chyba při rezervaci: ${response.data?.error || 'Unknown error'}`);
            }
        } catch (error) {
            alert(`Chyba při rezervaci: ${error.response?.data?.error || error.message}`);
        }
    };

    const getEndpointByType = (type) => {
        switch (type) {
            case 'bar':
                return '/bars';
            case 'lift':
                return '/lifts';
            case 'room':
            default:
                return '/rooms';
        }
    };

    const handleCommoditySelection = (commodity, type) => {
        setSelectedCommodity({ ...commodity, type });
        setSelectedDate(null); // Clear selected date when commodity changes
        setAvailableTimes([]); // Clear available times
        setSelectedDate(null);
        if (selectedDate) { // Add this check
            fetchAvailableTimes(commodity.service.serviceId, type, selectedDate);
        }
        if (reservationFormRef.current) {
            reservationFormRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (selectedCommodity) {
            fetchAvailableTimes(selectedCommodity.service.serviceId, selectedCommodity.type, date);  // Fetch available times on date change
        }
    };

    const fetchAvailableTimes = async (serviceId, serviceType, date) => {
        // Fetch available times for the selected commodity
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Adjust for timezone

        const startTime = localDate.toISOString().split('T')[0] + 'T00:00:00';
        let endTime = localDate.toISOString().split('T')[0] + 'T23:59:59';
        
        if (serviceType === 'ROOM') {
            const nextDay = new Date(localDate);
            nextDay.setDate(nextDay.getDate() + 1);  // Add one day
            endTime = nextDay.toISOString().split('T')[0] + 'T23:59:59';  // Adjust the end time to the next day
        }

        try {
            const response = await axiosConfig.post('/reservations/available-times', {
                serviceId: serviceId, 
                serviceType: serviceType,
                startTime: startTime,  
                endTime: endTime,     
            });
                  
            if (response.data["30_min_slots"]) {
                setAvailableTimes(response.data["30_min_slots"]);
            } else {
                console.log('No available times found in the response.');
                setAvailableTimes([]); 
            }
            console.log(availableTimes);

        } catch (error) {
            console.error('Error fetching available times:', error);
        }
    };

    const renderTimeSlots = () => {
        if (availableTimes.length === 0) {
            return <p>Žádné dostupné časy pro tuto komoditu pro zvolený den.</p>;
        }
    
        const mergedTimeSlots = [];
        let currentSlot = null;
    
        availableTimes.forEach((timeSlot, index) => {
            const time = new Date(timeSlot);
            
            if (!currentSlot) {
                // Start a new slot if currentSlot is null
                currentSlot = {
                    startTime: time,
                    endTime: new Date(time.getTime() + 30 * 60 * 1000), // Add 30 minutes for the initial end time
                };
            } else if (time.getTime() === currentSlot.endTime.getTime()) {
                // If the current timeSlot is exactly 30 minutes after the previous one, extend the end time
                currentSlot.endTime = new Date(time.getTime() + 30 * 60 * 1000);
            } else {
                // Push the current slot to mergedTimeSlots if the time gap is not 30 minutes
                mergedTimeSlots.push({
                    startTime: currentSlot.startTime,
                    endTime: currentSlot.endTime,
                    timeString: `${currentSlot.startTime.toLocaleTimeString('cs-CZ')} - ${currentSlot.endTime.toLocaleTimeString('cs-CZ')}`
                });
                // Start a new slot
                currentSlot = {
                    startTime: time,
                    endTime: new Date(time.getTime() + 30 * 60 * 1000),
                };
            }
    
            // Add the last slot after the loop ends
            if (index === availableTimes.length - 1) {
                mergedTimeSlots.push({
                    startTime: currentSlot.startTime,
                    endTime: currentSlot.endTime,
                    timeString: `${currentSlot.startTime.toLocaleTimeString('cs-CZ')} - ${currentSlot.endTime.toLocaleTimeString('cs-CZ')}`
                });
            }
        });

        const handleSlotClick = (startTime, endTime) => {
            setSelectedStartTime(startTime);
            setSelectedEndTime(endTime);
        };
    
        return (
            <div className="time-slot-grid">
                {mergedTimeSlots.map((slot, index) => (                   
                    <button
                        key={index}
                        className="time-slot available"
                        onClick={() => handleSlotClick(slot.startTime, slot.endTime)}
                        title="Kliknutím zadáte časy do políček."
                        style={{
                            padding: '10px',
                            border: 'none',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            margin: '5px',
                        }}
                    >
                        {slot.timeString}
                    </button>
                ))}
            </div>
        );
    };
    
    


    return (
        <div className="commodities-container">
            <h2>Dostupné komodity k rezervaci</h2>
            <div className="commodity-section">
                <h3 className="commodity-title">Pokoje</h3>
                <div className="commodity-list">
                    {rooms.map(room => (
                        <div key={room.serviceId} className="commodity-item">
                            <p>Název: {room.service.serviceName}</p>
                            <p>Kapacita: {room.capacity}</p>
                            <p>Cena za noc: {room.pricePerNight}</p>
                            <div className="button-group">
                                <button className="green-button" onClick={() => handleCommoditySelection(room, 'ROOM')}>Rezervovat</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="commodity-section">
                <h3 className="commodity-title">Bary</h3>
                <div className="commodity-list">
                    {bars.map(bar => (
                        <div key={bar.serviceId} className="commodity-item">
                            <p>Název: {bar.service.serviceName}</p>
                            <p>Typ kuchyně: {bar.cuisineType}</p>
                            <p>Umístění: {bar.location}</p>
                            <div className="button-group">
                                <button className="green-button" onClick={() => handleCommoditySelection(bar, 'BAR')}>Rezervovat</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="commodity-section">
                <h3 className="commodity-title">Lanovky</h3>
                <div className="commodity-list">
                    {lifts.map(lift => (
                        <div key={lift.serviceId} className="commodity-item">
                            <p>Název: {lift.service.serviceName}</p>
                            <p>Kapacita: {lift.capacity}</p>
                            <p>Stav: {lift.status}</p>
                            <div className="button-group">
                                <button className="green-button" onClick={() => handleCommoditySelection(lift, 'LIFT')}>Rezervovat</button>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Form for time selection and reservation */}
                <div className="reservation-form" ref={reservationFormRef}>
                    {selectedCommodity && (
                        <>
                            <h3>Rezervace</h3>
                            <div>
                                <p>Rezervujete: <strong>{selectedCommodity.service.serviceName}</strong></p>
                            </div>
                            <div>
                                <label>Datum rezervace:</label>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    locale="cs"
                                    placeholderText="Vyberte datum"
                                    withPortal
                                />
                            </div>
                            <div>
                                <p>Kliknutím na tlačítko času jej zadáte do položek začátku a konce rezervace.<br/>
                                Políčko času lze nesledně při rozkliknutí políček upravit.</p>
                            </div>
                            {renderTimeSlots()}
                            <div>
                                <label>Začátek rezervace:</label>
                                <DatePicker
                                    selected={selectedStartTime}
                                    onChange={date => setSelectedStartTime(date)}
                                    showTimeSelect
                                    locale="cs"
                                    dateFormat="Pp"
                                    placeholderText="Vyberte čas začátku"
                                    withPortal
                                    timeCaption="Čas"
                                />
                            </div>
                            <div>
                                <label>Konec rezervace:</label>
                                <DatePicker
                                    selected={selectedEndTime}
                                    onChange={date => setSelectedEndTime(date)}
                                    showTimeSelect
                                    locale="cs"
                                    dateFormat="Pp"
                                    placeholderText="Vyberte čas konce"
                                    withPortal
                                    timeCaption="Čas"
                                />
                            </div>
                            <button onClick={() => handleReservation(selectedCommodity, selectedCommodity.type)}>Rezervovat</button>
                        </>
                    )}</div>
            </div>
        </div>
    );
}

export default AvailableCommodities;
