import React, { useEffect, useState } from 'react';
import axiosConfig from '..//..//axios';
import '../../styles/App.css';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        axiosConfig.get('auth/users')
        .then(response => {
            setUsers(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Chyba:', error);
            setLoading(false);
        });
    };

    const [scrollToEdit, setScrollToEdit] = useState(false);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setRole(user.role);
        setScrollToEdit(true);
    };
    
    useEffect(() => {
        if (scrollToEdit) {
            const editUserRoleElement = document.getElementById('edit-user-role');
            if (editUserRoleElement) {
                editUserRoleElement.scrollIntoView({ behavior: 'smooth' });
                setScrollToEdit(false);
            }
        }
    }, [scrollToEdit]);

    const handleUpdateUserRole = () => {
        if (!selectedUser) return;

        axiosConfig.put(`auth/users/${selectedUser.id}`, { role })
        .then(response => {
            alert('Uživatelská role upravena úspěšně.');
            fetchUsers();
            setSelectedUser(null);
        })
        .catch(error => console.error('Chyba při úpravě role uživatele:', error));
    };

    const handleDeleteUser = (userId) => {
        if (!window.confirm('Jste si jistí že chcete odstranit uživatele?')) return;

        axiosConfig.delete(`auth/users/${userId}`)
        .then(response => {
            if (response.status === 200) {
                alert('Uživatel byl úspěšně smazán.');
                fetchUsers();
            } else {
                alert('Chyba při odstranění uživatele.');
            }
        })
        .catch(error => console.error('Error deleting user:', error));
    };

    return (
        <div>
            <h2>Správa uživatelů</h2>
            {loading ? (
                <p>Načítání uživatelů...</p>
            ) : (
                <div className="table-responsive">
                    <table className="userTable">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Uživatelské jméno</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Křestní jméno</th>
                            <th>Příjmení</th>
                            <th>Telefonní číslo</th>
                            <th>Akce</th>
                        </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                <td data-label="ID">{user.id}</td>
                                <td data-label="Uživatelské jméno">{user.username}</td>
                                <td data-label="Email">{user.email}</td>
                                <td data-label="Role">{user.role}</td>
                                <td data-label="Křestní jméno">{user.firstName}</td>
                                <td data-label="Příjmení">{user.surname}</td>
                                <td data-label="Telefonní číslo">{user.phoneNumber}</td>
                                <td data-label="Akce">
                                    <button onClick={() => handleSelectUser(user)}>Upravit roli</button>
                                    <button onClick={() => handleDeleteUser(user.id)}>Smazat</button>
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {selectedUser && (
            <div id="edit-user-role">
                <h3>Upravit roli uživatele</h3>
                <p>Uživatelské jméno: {selectedUser.username}</p>
                <p>Email: {selectedUser.email}</p>
                <label>
                    Role:
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="USER">Uživatel</option>
                        <option value="MANAGER">Manažer</option>
                        <option value="ADMIN">Administrátor</option>
                    </select>
                </label>
                <button onClick={handleUpdateUserRole}>Aktualizovat roli</button>
            </div>
            )}
        </div>
    );
}

export default ManageUsers;