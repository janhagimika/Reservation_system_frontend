import React, { useState, useEffect } from 'react';
import axiosConfig from '..//..//axios';
import '../../styles/App.css'; // Assuming you have some CSS for styling

function SystemSettings() {
    const [businessHours, setBusinessHours] = useState({
        openBar: '09:00',
        closeBar: '18:00',
        openLift: '08:00',
        closeLift: '18:00'
    });

    useEffect(() => {
        // Fetch business hours from backend
        axiosConfig.get('system/business-hours')
            .then(response => {
                const { openBar, closeBar, openLift, closeLift } = response.data;
                setBusinessHours({ openBar, closeBar, openLift, closeLift });
            })
            .catch(error => console.error('Chyba při načítání provozní doby:', error));
    }, []);

    const handleResetDatabase = () => {
        axiosConfig.post('system/reset')
            .then(response => alert(response.data))
            .catch(error => console.error('Chyba při resetování databáze:', error));
    };

    const handleSaveBusinessHours = () => {
        axiosConfig.put('system/business-hours', businessHours)
            .then(() => alert('Provozní doba byla úspěšně uložena'))
            .catch(error => console.error('Chyba při ukládání provozní doby:', error));
    };

    return (
        <div>
            <h2>Nastavení systému</h2>
            
            {/* Button to reset the database */}
            <button onClick={handleResetDatabase} className="red-button">Resetovat databázi</button>

            <div>
                <h3>Provozní hodiny Bar</h3>
                <label>
                    Otevírací doba (Bar):
                    <input 
                        type="time" 
                        value={businessHours.openBar} 
                        onChange={(e) => setBusinessHours({ ...businessHours, openBar: e.target.value })} 
                    />
                </label>
                <label>
                    Zavírací doba (Bar):
                    <input 
                        type="time" 
                        value={businessHours.closeBar} 
                        onChange={(e) => setBusinessHours({ ...businessHours, closeBar: e.target.value })} 
                    />
                </label>
            </div>

            <div>
                <h3>Provozní hodiny Lanovka</h3>
                <label>
                    Otevírací doba (Lanovka):
                    <input 
                        type="time" 
                        value={businessHours.openLift} 
                        onChange={(e) => setBusinessHours({ ...businessHours, openLift: e.target.value })} 
                    />
                </label>
                <label>
                    Zavírací doba (Lanovka):
                    <input 
                        type="time" 
                        value={businessHours.closeLift} 
                        onChange={(e) => setBusinessHours({ ...businessHours, closeLift: e.target.value })} 
                    />
                </label>
            </div>

            {/* Button to save the changes */}
            <button onClick={handleSaveBusinessHours} className="green-button">Uložit změny</button>
        </div>
    );
}

export default SystemSettings;
