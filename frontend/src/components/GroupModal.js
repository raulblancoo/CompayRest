import React, { useState } from "react";

const GroupModal = ({ isOpen, onClose, onSubmit }) => {
    const [groupName, setGroupName] = useState("");
    const [currency, setCurrency] = useState("EUR");
    const [emails, setEmails] = useState([]);

    const [emailInput, setEmailInput] = useState("");

    const handleAddEmail = () => {
        if (emailInput && !emails.includes(emailInput)) {
            setEmails([...emails, emailInput]);
            setEmailInput("");
        }
    };

    const handleRemoveEmail = (emailToRemove) => {
        setEmails(emails.filter((email) => email !== emailToRemove));
    };

    const handleSubmit = () => {
        const data = {
            group_name: groupName,
            currency,
            userEmails: emails,
        };

        onSubmit(data);
        handleClose();
    };

    const handleClose = () => {
        setGroupName("");
        setCurrency("EUR");
        setEmails([]);
        setEmailInput("");
        onClose(); // Cierra la modal
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-xl font-semibold mb-4">Crear Nuevo Grupo</h2>
                <form>
                    {/* Input: Nombre del grupo */}
                    <div className="mb-4">
                        <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
                            Nombre del Grupo
                        </label>
                        <input
                            type="text"
                            id="groupName"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        />
                    </div>

                    {/* Select: Moneda */}
                    <div className="mb-4">
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                            Moneda
                        </label>
                        <select
                            id="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        >
                            <option value="EUR">Euro (€)</option>
                            <option value="USD">Dólar ($)</option>
                            <option value="GBP">Libra (£)</option>
                            <option value="JPY">Yen Japonés (¥)</option>
                        </select>
                    </div>

                    {/* Input: Emails */}
                    <div className="mb-4">
                        <label htmlFor="emails" className="block text-sm font-medium text-gray-700">
                            Correos Electrónicos
                        </label>
                        <div className="flex">
                            <input
                                type="email"
                                id="emails"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder="Añadir email"
                                className="w-full border border-gray-300 rounded-md p-2 mt-1 mr-2"
                            />
                            <button
                                type="button"
                                onClick={handleAddEmail}
                                className="bg-blue-600 text-white px-3 py-2 rounded-md"
                            >
                                Añadir
                            </button>
                        </div>
                        <div className="mt-2">
                            {emails.map((email, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center bg-gray-100 rounded-md p-2 mt-1"
                                >
                                    <span>{email}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveEmail(email)}
                                        className="text-red-500"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>

                {/* Botones */}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={handleClose}
                        className="bg-gray-300 px-4 py-2 rounded-md"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupModal;
