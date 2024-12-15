import React, { useState, useEffect } from "react";

const AddExpenseModal = ({ isOpen, onClose, groupId, onSubmit }) => {
    const [members, setMembers] = useState([]); // Lista de miembros del grupo
    const [selectedPayer, setSelectedPayer] = useState(""); // Miembro pagador
    const [selectedMembers, setSelectedMembers] = useState([]); // Miembros seleccionados para compartir gasto
    const [expenseName, setExpenseName] = useState("");
    const [amount, setAmount] = useState("");
    const [shareMethod, setShareMethod] = useState("PARTESIGUALES");
    const [shares, setShares] = useState({}); // Almacena la distribución del mapa

    // Cargar miembros del grupo
    useEffect(() => {
        if (!groupId) return;
        fetch(`http://localhost:8080/users/1/groups/${groupId}/members`)
            .then((response) => response.json())
            .then((data) => setMembers(data))
            .catch((error) => console.error("Error al cargar miembros:", error));
    }, [groupId]);

    const handleMemberSelection = (email) => {
        setSelectedMembers((prev) =>
            prev.includes(email)
                ? prev.filter((member) => member !== email) // Deselect member
                : [...prev, email] // Select member
        );
    };

    const calculateShares = () => {
        const totalAmount = parseFloat(amount); // Convertir a número
        if (isNaN(totalAmount) || totalAmount <= 0) return; // Validar monto positivo

        const selectedCount = selectedMembers.length;

        if (shareMethod === "PARTESIGUALES" && selectedCount > 0) {
            // Reparto en partes iguales
            const equalShare = totalAmount / selectedCount;
            setShares(
                selectedMembers.reduce((acc, email) => {
                    acc[email] = equalShare;
                    return acc;
                }, {})
            );
        } else if (shareMethod === "PARTESDESIGUALES") {
            // Reparto en partes desiguales: conservar valores existentes
            setShares(
                selectedMembers.reduce((acc, email) => {
                    acc[email] = shares[email] || 0; // Mantener valores previos o asignar 0
                    return acc;
                }, {})
            );
        } else if (shareMethod === "PORCENTAJES") {
            // Validar que los porcentajes sumen 100
            const totalPercentage = selectedMembers.reduce((sum, email) => {
                return sum + (shares[email] || 0);
            }, 0);

            if (totalPercentage !== 100) {
                alert("Los porcentajes deben sumar 100%");
                return; // Salir de la función si la validación falla
            }

            // Crear un nuevo objeto con los montos calculados
            const calculatedShares = selectedMembers.reduce((acc, email) => {
                const percentage = shares[email] || 0; // Obtener porcentaje del miembro
                acc[email] = (totalAmount * percentage) / 100; // Calcular monto
                return acc;
            }, {});

            // Actualizar el estado de shares con los montos calculados
            setShares(calculatedShares);
        }
    };


    useEffect(() => {
        calculateShares();
    }, [shareMethod, amount, selectedMembers]);

    const handleShareChange = (email, value) => {
        setShares((prev) => ({
            ...prev,
            [email]: parseFloat(value),
        }));
    };

    const handleSubmit = () => {
        const totalAmount = parseFloat(amount);

        // Validar que el monto sea positivo
        if (isNaN(totalAmount) || totalAmount <= 0) {
            alert("Por favor, introduce un monto válido.");
            return;
        }

        let finalShares = { ...shares }; // Por defecto, usar lo que ya esté en shares

        if (shareMethod === "PORCENTAJES") {
            const totalPercentage = Object.values(shares).reduce((sum, percentage) => sum + percentage, 0);

            if (totalPercentage !== 100) {
                alert("La suma de los porcentajes debe ser igual a 100.");
                return;
            }

            finalShares = Object.keys(shares).reduce((acc, email) => {
                acc[email] = (totalAmount * shares[email]) / 100;
                return acc;
            }, {});
        }

        // Validar que la suma de las participaciones coincida con el monto total para "PARTESDESIGUALES"
        if (shareMethod === "PARTESDESIGUALES") {
            const totalShares = Object.values(finalShares).reduce((sum, share) => sum + share, 0);
            if (totalShares !== totalAmount) {
                alert("La suma de las participaciones debe coincidir con el monto total.");
                return;
            }
        }

        // Preparar los datos para enviar
        const data = {
            amount: totalAmount,
            expense_name: expenseName,
            originUserId: selectedPayer,
            share_method: shareMethod,
            shares: finalShares, // Usar los valores calculados
        };

        // Enviar los datos al backend
        onSubmit(data);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-xl font-semibold mb-4">Crear Nuevo Gasto</h2>
                <form>
                    {/* Selector: Pagador */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Pagador
                        </label>
                        <select
                            value={selectedPayer}
                            onChange={(e) => setSelectedPayer(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        >
                            <option value="">Selecciona un miembro</option>
                            {members.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name} {member.surname}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Checkboxes: Selección de miembros */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Miembros del grupo
                        </label>
                        {members.map((member) => (
                            <div key={member.email} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`member-${member.email}`}
                                    checked={selectedMembers.includes(member.email)}
                                    onChange={() => handleMemberSelection(member.email)}
                                    className="mr-2"
                                />
                                <label htmlFor={`member-${member.email}`}>
                                    {member.name} {member.surname} ({member.email})
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Input: Nombre del gasto */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Nombre del Gasto
                        </label>
                        <input
                            type="text"
                            value={expenseName}
                            onChange={(e) => setExpenseName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        />
                    </div>

                    {/* Input: Cantidad Total */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Cantidad total
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        />
                    </div>

                    {/* Selector: Método de Compartición */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Método de División
                        </label>
                        <select
                            value={shareMethod}
                            onChange={(e) => setShareMethod(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        >
                            <option value="PARTESIGUALES">Partes Iguales</option>
                            <option value="PARTESDESIGUALES">Partes Desiguales</option>
                            <option value="PORCENTAJES">Porcentajes</option>
                        </select>
                    </div>

                    {/*TODO: cambiar para que muestre los nombres aunque envíe los emails*/}
                    {/* Inputs dinámicos: Según el método de compartición */}
                    {selectedMembers.length > 0 && shareMethod !== "PARTESIGUALES" && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                {shareMethod === "PARTESDESIGUALES" ? "Distribución" : "Porcentajes"}
                            </label>
                            {selectedMembers.map((email) => (
                                <div key={email} className="flex items-center gap-2 mt-2">
                                    <span className="w-1/2">{email}</span>
                                    <input
                                        type="number"
                                        value={shares[email] || ""}
                                        onChange={(e) =>
                                            handleShareChange(email, e.target.value)
                                        }
                                        className="w-1/2 border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </form>

                {/* Botones */}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
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

export default AddExpenseModal;
