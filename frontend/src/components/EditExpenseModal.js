import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";

const EditExpenseModal = ({ isOpen, onClose, groupId, expense, onSubmit }) => {
    const [members, setMembers] = useState([]);
    const [selectedPayer, setSelectedPayer] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [expenseName, setExpenseName] = useState("");
    const [amount, setAmount] = useState("");
    const [shareMethod, setShareMethod] = useState("PARTESIGUALES");
    const [shares, setShares] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!expense || !expense.id || !groupId) return;

        const fetchData = async () => {
            try {
                // Fetch group members
                const membersResponse = await axiosInstance.get(
                    `/users/groups/${groupId}/members`
                );
                const membersData = membersResponse.data;
                setMembers(membersData);

                // Fetch expense details
                const expenseResponse = await axiosInstance.get(
                    `/users/groups/${groupId}/expenses/${expense.id}`
                );
                const expenseData = expenseResponse.data;

                // Extract emails and shares
                const fetchedShares = expenseData.shares.reduce((acc, share) => {
                    acc[share.destiny_user.email] = share.assignedAmount || 0;
                    return acc;
                }, {});

                setShares(fetchedShares);
                setSelectedMembers(Object.keys(fetchedShares));

                setSelectedPayer(expenseData.origin_user.id || membersData[0]?.id || "");
                setExpenseName(expenseData.expense_name || "");
                setAmount(expenseData.amount || "");
                setShareMethod(expenseData.share_method || "PARTESIGUALES");
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        };

        fetchData();
    }, [expense, groupId]);

    const handleMemberSelection = (email) => {
        setSelectedMembers((prev) => {
            const updatedMembers = prev.includes(email)
                ? prev.filter((member) => member !== email)
                : [...prev, email];

            // Remove unselected members from shares
            setShares((prevShares) => {
                const updatedShares = { ...prevShares };
                Object.keys(updatedShares).forEach((key) => {
                    if (!updatedMembers.includes(key)) {
                        delete updatedShares[key];
                    }
                });
                return updatedShares;
            });

            return updatedMembers;
        });
    };

    const handleShareChange = (email, value) => {
        setShares((prev) => ({
            ...prev,
            [email]: parseFloat(value),
        }));
    };

    const handleSubmit = async () => {
        const totalAmount = parseFloat(amount);
        const newErrors = {};

        // Validar nombre del gasto
        if (!expenseName || expenseName.trim().length === 0 || expenseName.length > 30) {
            newErrors.expenseName = "El nombre del gasto no puede estar vacío ni tener más de 30 caracteres.";
        }

        // Validar cantidad positiva
        if (isNaN(totalAmount) || totalAmount <= 0) {
            newErrors.amount = "La cantidad del pago debe ser un número positivo.";
        }

        // Validar shares
        if (shareMethod === "PARTESDESIGUALES") {
            const totalShares = selectedMembers.reduce((sum, email) => sum + (shares[email] || 0), 0);
            if (totalShares !== totalAmount) {
                newErrors.shares = "La suma de la distribución debe coincidir con la cantidad total.";
            }
        } else if (shareMethod === "PORCENTAJES") {
            const totalPercentage = selectedMembers.reduce((sum, email) => sum + (shares[email] || 0), 0);
            if (totalPercentage !== 100) {
                newErrors.shares = "La suma de los porcentajes debe ser igual a 100.";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const updatedExpense = {
            ...expense,
            amount: totalAmount,
            expense_name: expenseName,
            share_method: shareMethod,
            origin_user: { id: selectedPayer }, // Correct assignment of payer
            shares: selectedMembers.map(email => ({
                destiny_user: { email },
                assignedAmount: shares[email] || 0,
            })),
            group: { id: groupId },
            expense_date: new Date().toISOString(),
        };

        try {
            const response = await axiosInstance.put(
                `/user/groups/${groupId}/expenses/${expense.id}`,
                updatedExpense
            );
            onSubmit(response.data);
            onClose();
        } catch (error) {
            console.error("Error al guardar el gasto:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-xl font-semibold mb-4">Editar Gasto</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Pagador</label>
                        <select
                            value={selectedPayer}
                            onChange={(e) => setSelectedPayer(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        >
                            {members.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name} {member.surname}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Miembros</label>
                        {members.map((member) => (
                            <div key={member.email} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedMembers.includes(member.email)}
                                    onChange={() => handleMemberSelection(member.email)}
                                    className="mr-2"
                                />
                                <label>{member.name} {member.surname}</label>
                            </div>
                        ))}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={expenseName}
                            onChange={(e) => setExpenseName(e.target.value)}
                            className={`w-full border ${errors.expenseName ? "border-red-500" : "border-gray-300"} rounded-md p-2`}
                        />
                        {errors.expenseName && <p className="text-red-500 text-sm mt-1">{errors.expenseName}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={`w-full border ${errors.amount ? "border-red-500" : "border-gray-300"} rounded-md p-2`}
                        />
                        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Método de División</label>
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

                    {selectedMembers.length > 0 && shareMethod !== "PARTESIGUALES" && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                {shareMethod === "PARTESDESIGUALES" ? "Distribución" : "Porcentajes"}
                            </label>
                            {selectedMembers.map((email) => {
                                const member = members.find((m) => m.email === email);
                                return (
                                    <div key={email} className="flex items-center gap-2 mt-2">
                                        <span className="w-1/2">{member?.name} {member?.surname}</span>
                                        <input
                                            type="number"
                                            value={shares[email] || ""}
                                            onChange={(e) => handleShareChange(email, e.target.value)}
                                            className={`w-1/2 border ${errors.shares ? "border-red-500" : "border-gray-300"} rounded-md p-2`}
                                        />
                                    </div>
                                );
                            })}
                            {errors.shares && <p className="text-red-500 text-sm mt-1">{errors.shares}</p>}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded-md"
                        >
                            Cerrar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditExpenseModal;
