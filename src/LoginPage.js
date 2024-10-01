import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/App.css'; // Import the CSS file

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // success nebo error
    const navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            username: username,
            password: password,
        };

        fetch('https://localhost:8443/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.accessToken) {  // Zde kontrolujeme, jestli data obsahují token
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('role', data.role);

                // Navigate to dashboard based on role

                const role = data.role;
                let dashboardUrl;
                switch (role) {
                    case 'USER':
                    dashboardUrl = '/user';
                    break;
                    case 'MANAGER':
                    dashboardUrl = '/manager';
                    break;
                    case 'ADMIN':
                    dashboardUrl = '/admin';
                    break;
                    default:
                    dashboardUrl = '/login';
                }
                navigate(dashboardUrl);
            } else {
                setMessage(data.error);
                setMessageType('error');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            setMessage('Došlo k nečekané chybě. Zkuste to prosím znovu.');
            setMessageType('error');
        });
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>Přihlášení</h2>
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
                    <button type="submit">Přihlásit</button>
                </form>
                <p className={messageType}>{message}</p> {}
                <a href="/register">Nemáte účet? Registrujte se zde.</a>
            </div>
        </div>
    );
}

export default LoginPage;
