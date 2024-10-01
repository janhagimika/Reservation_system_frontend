import React, { useState, useEffect } from 'react';
import axiosConfig from '..//..//axios'; // Import the axios configuration

function UserProfile() {
    const [user, setUser] = useState({
        id: '',
        firstName: '',
        surname: '',
        email: '',
        phoneNumber: ''
    });
    const [isEditing, setIsEditing] = useState(false);  // State to handle edit mode
    const [originalUser, setOriginalUser] = useState({}); // To store original data for cancelation
    const [isPasswordChange, setIsPasswordChange] = useState(false);  // State for password change mode
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState(''); // State to show password errors
    const [passwordSuccess, setPasswordSuccess] = useState(false); // State 

    // Fetch uživatelských údajů z backendu
    const fetchProfile = () => {
        axiosConfig.get('/auth/profile')
        .then(response => response.data)
        .then(data => {
            setUser(data);  // Populate form with user data
            setOriginalUser(data); // Store the original data
            localStorage.setItem('userId', data.id);  // Store userId in localStorage
        })
        .catch(error => console.error('Chyba při načítání profilu:', error));
    };

    useEffect(() => {
        fetchProfile(); // Initial fetch on component mount
    }, []);

    // Handle změny ve formulářových polích
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    // Handle změna hesla
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prevPasswords => ({
            ...prevPasswords,
            [name]: value
        }));

        // Basic password validation (e.g., length or matching)
        if (name === 'confirmPassword' || name === 'newPassword') {
            if (passwords.newPassword !== value && name === 'confirmPassword') {
                setPasswordError('Hesla se neshodují');
            } else if (value.length < 8) {
                setPasswordError('Heslo musí být alespoň 8 znaků dlouhé');
            } else {
                setPasswordError('');
            }
        }
    };

    // Handle formulář pro aktualizaci uživatelských údajů
    const handleUpdate = () => {
        axiosConfig.put(`/auth/users/${user.id}`, {
            firstName: user.firstName,
            surname: user.surname,
            email: user.email,
            phoneNumber: user.phoneNumber
        })
        .then(() => {
            alert('Profil úspěšně aktualizován!');
            fetchProfile();
            setIsEditing(false);  // Exit edit mode
        })
        .catch(error => {
            console.error('Chyba při aktualizaci profilu:', error);
            alert('Nepodařilo se aktualizovat profil.');
        });
    };

    // Handle změna hesla
    const handlePasswordUpdate = () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert('Hesla se neshodují.');
            return;
        }

        axiosConfig.put(`/auth/user/change-password/${user.id}`, {
            oldPassword: passwords.oldPassword,  
            newPassword: passwords.newPassword
        })
        .then(response => {
            alert('Heslo bylo úspěšně změněno!');
            setIsPasswordChange(false);  // Exit password change mode
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Reset fields
            setPasswordSuccess(true); // Indicate success
        })
        .catch(error => {
            console.error('Chyba při změně hesla:', error);
            alert('Nepodařilo se změnit heslo.');
        });
    };

    // Handle cancel (revert changes)
    const handleCancel = () => {
        setUser(originalUser); // Revert back to original user data
        setIsEditing(false);  // Exit edit mode
    };

    // Toggle edit mode
    const handleEdit = () => {
        setIsEditing(true);  // Enter edit mode
    };

    return (
        <div>
            <h2>Profil uživatele</h2>
            {isEditing ? (
                <form>
                    <label>
                        Jméno:
                        <input 
                            type="text" 
                            name="firstName" 
                            value={user.firstName} 
                            onChange={handleChange} 
                        />
                    </label>
                    <br />
                    <label>
                        Příjmení:
                        <input 
                            type="text" 
                            name="surname" 
                            value={user.surname} 
                            onChange={handleChange} 
                        />
                    </label>
                    <br />
                    <label>
                        Email:
                        <input 
                            type="email" 
                            name="email" 
                            value={user.email} 
                            onChange={handleChange} 
                        />
                    </label>
                    <br />
                    <label>
                        Telefonní číslo:
                        <input 
                            type="text" 
                            name="phoneNumber" 
                            value={user.phoneNumber} 
                            onChange={handleChange} 
                        />
                    </label>
                    <br />
                    <button type="button" onClick={handleUpdate}>Uložit změny</button>
                    <button type="button" onClick={handleCancel}>Zrušit</button>
                </form>
            ) : (
                <div>
                    <p>Jméno: {user.firstName} {user.surname}</p>
                    <p>Email: {user.email}</p>
                    <p>Telefon: {user.phoneNumber}</p>
                    <button onClick={handleEdit}>Upravit profil</button>
                </div>
            )}

            <h3>Změnit heslo</h3>
            {isPasswordChange ? (
                <form>
                    <label>
                        Staré heslo:
                        <input 
                            type="password" 
                            name="oldPassword" 
                            value={passwords.oldPassword} 
                            onChange={handlePasswordChange} 
                        />
                    </label>
                    <br />
                    <label>
                        Nové heslo:
                        <input 
                            type="password" 
                            name="newPassword" 
                            value={passwords.newPassword} 
                            onChange={handlePasswordChange} 
                        />
                    </label>
                    <br />
                    <label>
                        Potvrdit nové heslo:
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            value={passwords.confirmPassword} 
                            onChange={handlePasswordChange} 
                        />
                    </label>
                    <br />
                    {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
                    <button 
                        type="button" 
                        onClick={handlePasswordUpdate} 
                        disabled={passwordError !== '' || passwords.newPassword === ''}
                    >
                        Změnit heslo
                    </button>
                    <button type="button" onClick={() => setIsPasswordChange(false)}>Zrušit</button>
                </form>
            ) : (
                <>
                    <button onClick={() => setIsPasswordChange(true)}>Změnit heslo</button>
                    {passwordSuccess && <p style={{ color: 'green' }}>Heslo bylo úspěšně změněno!</p>}
                </>
            )}
        </div>
    );
}

export default UserProfile;
