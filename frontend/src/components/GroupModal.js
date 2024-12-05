import React, { useState, useEffect } from "react";

const GroupModal = ({
                        isOpen,
                        onClose,
                        onSubmit,
                        initialValues = { groupName: "", currency: "EURO" },
                        showEmails = true
                    }) => {
    const [groupName, setGroupName] = useState(initialValues.groupName);
    const [currency, setCurrency] = useState(initialValues.currency);
    const [emails, setEmails] = useState([]);

    // Resetea los campos cuando la modal se abre o se cierra
    useEffect(() => {
        setGroupName(initialValues.groupName || "");
        setCurrency(initialValues.currency || "EURO");
        setEmails([]);
    }, [isOpen, initialValues]);

    const handleAddEmail = (email) => {
        if (email && !emails.includes(email)) {
            setEmails([...emails, email]);
        }
    };

    const handleRemoveEmail = (email) => {
        setEmails(emails.filter((e) => e !== email));
    };

    const handleSubmit = () => {
        const groupData = { groupName, currency };
        if (showEmails) groupData.emails = emails;
        onSubmit(groupData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">
                    {initialValues.groupName ? "Editar Grupo" : "Crear Grupo"}
                </h2>

                {/* Campo Nombre del Grupo */}
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre del Grupo</label>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                {/* Selector de Moneda */}
                <div className="mb-4">
                    <label className="block text-gray-700">Moneda</label>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">Dólar ($)</option>
                        <option value="GBP">Libra (£)</option>
                    </select>
                </div>

                {/* Campo de Emails (opcional) */}
                {showEmails && (
                    <div className="mb-4">
                        <label className="block text-gray-700">Emails</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="email"
                                placeholder="Agregar email"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleAddEmail(e.target.value);
                                        e.target.value = "";
                                    }
                                }}
                                className="flex-grow p-2 border rounded-md"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
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
                )}

                {/* Botones */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-md"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                        {initialValues.groupName ? "Actualizar" : "Crear"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupModal;
