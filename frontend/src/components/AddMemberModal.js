import React, { useState } from 'react';
import axiosInstance from "../components/axiosInstance";
import { jwtDecode } from 'jwt-decode';

const AddMemberModal = ({ onClose, idGroup }) => {
    const [emails, setEmails] = useState([]);
    const [currentEmail, setCurrentEmail] = useState('');

    const handleAddEmail = () => {
        if (currentEmail && !emails.includes(currentEmail)) {
            setEmails([...emails, currentEmail]);
            setCurrentEmail(''); // Resetea el campo
        }
    };

    const handleRemoveEmail = (email) => {
        setEmails(emails.filter((e) => e !== email));
    };

    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return decoded.userId || decoded.id; // AJUSTA SEGÚN LA ESTRUCTURA DE TU TOKEN
            } catch (err) {
                console.error("Error decoding token:", err);
                return null;
            }
        }
        return null;
    };

    const userId = getUserIdFromToken();

    const handleSubmit = async () => {
        try {
            const response = await axiosInstance.post(`/users/${userId}/groups/${idGroup}/members/email`, emails);
            alert('Miembros añadidos correctamente');
            onClose();
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al añadir los miembros');
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Añadir Miembros</h2>

                {/* Campo de Emails */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Emails</label>
                    <div className="flex gap-2 items-stretch">
                        <input
                            type="email"
                            placeholder="Agregar email"
                            value={currentEmail}
                            onChange={(e) => setCurrentEmail(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddEmail();
                                }
                            }}
                            className="flex-grow p-2 border rounded-l-md"
                        />
                        <button
                            onClick={handleAddEmail}
                            className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                        >
                            Añadir
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {emails.map((email) => (
                            <span
                                key={email}
                                className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
                            >
                                {email}
                                <button
                                    onClick={() => handleRemoveEmail(email)}
                                    className="text-red-500"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-100 rounded-lg mr-2"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                    >
                        Añadir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
