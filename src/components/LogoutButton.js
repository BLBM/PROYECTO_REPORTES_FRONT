// LogoutButton.js
import React from 'react';
import './LogoutButtonStyles.css'; // Asegúrate de importar el archivo CSS

const LogoutButton = ({ setToken }) => {
    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token'); // Elimina el token del almacenamiento local
        // Redirige al login o haz lo que necesites después de cerrar sesión
        window.location.href = '/login'; // O usa el hook de React Router si lo prefieres
    };

    return (
        <button onClick={handleLogout} className="logoutButton">
            Cerrar sesión
        </button>
    );
};

export default LogoutButton;
