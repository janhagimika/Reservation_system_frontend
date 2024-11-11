import React, { useState, useEffect, useLayoutEffect } from 'react';
import '../../styles/App.css'; // Assuming you have some CSS for styling
import axiosConfig from '..//..//axios';


function FullCommoditiesControl() {
    const [bars, setBars] = useState([]);
    const [lifts, setLifts] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [newItem, setNewItem] = useState({
        serviceName: '',
        type: 'room', // default to room
        capacity: '',
        pricePerNight: '',
        status: 'available',
        cuisineType: '',
        location: '',
        service: {
            serviceId: null,
            serviceName: '',
        },
    });

    const [editItem, setEditItem] = useState(null);
    const [scrollToEditForm, setScrollToEditForm] = useState(false);

    useLayoutEffect(() => {
        if (scrollToEditForm && document.getElementById('edit-form-anchor')) {
          document.getElementById('edit-form-anchor').scrollIntoView({ behavior: 'smooth' });
          setScrollToEditForm(false);
        }
      }, [scrollToEditForm]);

    useEffect(() => {
        // Fetching all bars, lifts, and rooms from the backend
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

    const handleAddItem = async () => {
        const endpoint = getEndpointByType(newItem.type);
        try {
            const commodityResponse = await axiosConfig.post(endpoint, { ...newItem, 
                });

            await fetchCommodities([newItem.type]);
            setNewItem({ serviceName: '', type: '', capacity: '', pricePerNight: '', status: 'available', cuisineType: '',service: {
                serviceId: null,
                serviceName: '',
            },
                location: '' });
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleDeleteItem = async (id, type) => {
        if (!window.confirm('Jste si jistí že chcete odstranit komoditu?')) return;

        const endpoint = getEndpointByType(type);
        try {
            await axiosConfig.delete(`${endpoint}/${id}`);
            await fetchCommodities([type]);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleEditItem = async () => {
        const endpoint = getEndpointByType(editItem.type);
        try {
            const response = await axiosConfig.put(`${endpoint}/${editItem.serviceId}`, editItem);
    
            // Since axios automatically parses the response, you can access the data directly
            const data = response.data;
    
            // Optionally, handle the data if needed
            console.log('Updated item data:', data);
    
            // Fetch updated commodities only once after the update
            await fetchCommodities([editItem.type]);
    
            // Clear the edit item state
            setEditItem(null);
        } catch (error) {
            console.error('Error editing item:', error);
            // Optionally, show user feedback
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

    return (
        <div className="commodities-container">
            <h2>Správa Komodit</h2>
            <div className="commodity-section">
                <h3 className="commodity-title">Pokoje</h3>
                <div className="commodity-list">
                    {rooms.map(room => (
                        <div key={room.serviceId} className="commodity-item">
                            <p>Název: {room.serviceName}</p>
                            <p>Kapacita: {room.capacity}</p>
                            <p>Cena za noc: {room.pricePerNight}</p>
                            <div className="button-group">
                                <button className='red-button' onClick={() => handleDeleteItem(room.serviceId, 'room')}>Smazat</button>
                                <button className='green-button' onClick={() => {
                                    setEditItem({ ...room, type: 'room' });
                                    setScrollToEditForm(true);
                                }}>Upravit</button>
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
                            <p>Název: {bar.serviceName}</p>
                            <p>Typ kuchyně: {bar.cuisineType}</p>
                            <p>Umístění: {bar.location}</p>
                            <p>Kapacita: {bar.capacity}</p>
                            <div className="button-group">
                                <button className='red-button' onClick={() => handleDeleteItem(bar.serviceId, 'bar')}>Smazat</button>
                                <button className='green-button' onClick={() => {
                                    setEditItem({ ...bar, type: 'bar' });
                                    setScrollToEditForm(true);
                                }}>Upravit</button>
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
                            <p>Název: {lift.serviceName}</p>
                            <p>Kapacita: {lift.capacity}</p>
                            <p>Stav: {lift.status}</p>
                            <div className="button-group">
                                <button className='red-button' onClick={() => handleDeleteItem(lift.serviceId, 'lift')}>Smazat</button>
                                <button className='green-button' onClick={() => {
                                    setEditItem({ ...lift, type: 'lift' });
                                    setScrollToEditForm(true);
                                }}>Upravit</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {editItem ? (
                <div className="edit-commodity-form" id='edit-form-anchor'>
                    <h3 className="commodity-title">Upravit Komoditu</h3>
                    <input
                        type="text"
                        value={editItem.serviceName}
                        onChange={(e) => setEditItem({ ...editItem, serviceName: e.target.value })}
                        placeholder="Název"
                    />
                    {editItem.type === 'room' && (
                        <>
                            <input
                                type="text"
                                value={editItem.capacity}
                                onChange={(e) => setEditItem({ ...editItem, capacity: e.target.value })}
                                placeholder="Kapacita"
                            />
                            <input
                                type="number"
                                value={editItem.pricePerNight}
                                onChange={(e) => setEditItem({ ...editItem, pricePerNight: parseFloat(e.target.value).toFixed(2) })}
                                placeholder="Cena za noc"
                                step="0.01"  // This ensures input can have up to two decimal places
                                min="0"      // Optional: sets the minimum value to 0
                            />
                        </>
                    )}
                    {editItem.type === 'bar' && (
                        <>
                            <input
                                type="text"
                                value={editItem.cuisineType}
                                onChange={(e) => setEditItem({ ...editItem, cuisineType: e.target.value })}
                                placeholder="Typ kuchyně"
                            />
                            <input
                                type="text"
                                value={editItem.location}
                                onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                                placeholder="Umístění"
                            />
                            <input
                                type="text"
                                value={newItem.capacity}
                                onChange={(e) => setNewItem({ ...newItem, capacity: e.target.value })}
                                placeholder="Kapacita"
                            />
                        </>
                    )}
                    {editItem.type === 'lift' && (
                        <>
                            <input
                                type="text"
                                value={editItem.capacity}
                                onChange={(e) => setEditItem({ ...editItem, capacity: e.target.value })}
                                placeholder="Kapacita"
                            />
                            <select
                                value={editItem.status}
                                onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                            >
                                <option value="available">Dostupné</option>
                                <option value="unavailable">Nedostupné</option>
                            </select>
                        </>
                    )}
                    <button className='green-button' onClick={handleEditItem}>Uložit změny</button>
                    <button className='red-button' onClick={() => setEditItem(null)}>Zrušit</button>
                </div>
            ) : (
                <div className="add-commodity-form">
                    <h3 className="commodity-title">Přidat Novou Komoditu</h3>
                    <input
                        type="text"
                        value={newItem.serviceName}
                        onChange={(e) => setNewItem({ ...newItem, serviceName: e.target.value })}
                        placeholder="Název"
                    />
                    <select
                        value={newItem.type}
                        onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                    >
                        <option value="room">Pokoj</option>
                        <option value="bar">Bar</option>
                        <option value="lift">Lanovka</option>
                    </select>
                    {newItem.type === 'room' && (
                        <>
                            <input
                                type="text"
                                value={newItem.capacity}
                                onChange={(e) => setNewItem({ ...newItem, capacity: e.target.value })}
                                placeholder="Kapacita"
                            />
                            <input
                                type="number"
                                value={newItem.pricePerNight}
                                onChange={(e) => setNewItem({ ...newItem, pricePerNight: parseFloat(e.target.value).toFixed(2) })}
                                placeholder="Cena za noc"
                                step="0.01"  // This ensures input can have up to two decimal places
                                min="0"      // Optional: sets the minimum value to 0
                            />
                        </>
                    )}
                    {newItem.type === 'bar' && (
                        <>
                            <input
                                type="text"
                                value={newItem.cuisineType}
                                onChange={(e) => setNewItem({ ...newItem, cuisineType: e.target.value })}
                                placeholder="Typ kuchyně"
                            />
                            <input
                                type="text"
                                value={newItem.location}
                                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                                placeholder="Umístění"
                            />
                            <input
                                type="text"
                                value={newItem.capacity}
                                onChange={(e) => setNewItem({ ...newItem, capacity: e.target.value })}
                                placeholder="Kapacita"
                            />
                        </>
                    )}
                    {newItem.type === 'lift' && (
                        <>
                            <input
                                type="text"
                                value={newItem.capacity}
                                onChange={(e) => setNewItem({ ...newItem, capacity: e.target.value })}
                                placeholder="Kapacita"
                            />
                            <select
                                value={newItem.status}
                                onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                            >
                                <option value="available">Dostupné</option>
                                <option value="unavailable">Nedostupné</option>
                            </select>
                        </>
                    )}
                    <button className='green-button' onClick={handleAddItem}>Přidat Komoditu</button>
                </div>
            )}
        </div>
    );
}

export default FullCommoditiesControl;
