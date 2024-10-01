import React, { useState } from 'react';
import './styles/App.css'; // Import the CSS file

function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // success nebo error

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            username: username,
            password: password,
            firstName: firstName,
            surname: surname,
            email: email,
            phoneNumber: phoneNumber,
            role: "USER"  // Set the role to USER by default
        };

        fetch('https://localhost:8443/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    // Pokud je odpověď 200–299
                    return response.text().then((data) => {
                        setMessageType('success');
                        setMessage(data);
                    });
                } else {
                    // Pokud je odpověď mimo rozsah 200–299
                    return response.text().then((data) => {
                        setMessageType('error');
                        setMessage(data);
                    });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setMessage('Došlo k nečekané chybě. Zkuste to prosím znovu.');
            });
    };


    return (
        <div className="container">
            <div className="form-container">
                <h2>Registrace</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Uživatelské jméno:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Heslo:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Jméno:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Příjmení:</label>
                        <input
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Telefonní číslo:</label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Registrovat</button>
                </form>
                <p className={messageType}>{message}</p> {}
                <a href="/login">Už máte účet? Přihlaste se zde.</a>
            </div>
        </div>

    );
}

export default RegistrationPage;
