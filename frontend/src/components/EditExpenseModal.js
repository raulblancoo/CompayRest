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

    useEffect(() => {
        if (!expense || !expense.id || !groupId) return;

        const fetchData = async () => {
            try {
                // Fetch expense details
                const expenseResponse = await axiosInstance.get(
                    `/users/${expense.origin_user.id}/groups/${groupId}/expenses/${expense.id}`
                );

                // Extract emails and shares
                const fetchedShares = expenseResponse.data.shares.reduce((acc, share) => {
                    acc[share.destiny_user.email] = share.assignedAmount || 0;
                    return acc;
                }, {});

                setShares(fetchedShares);
                const emails = Object.keys(fetchedShares);
                setSelectedMembers(emails);

                // Fetch group members
                const membersResponse = await axiosInstance.get(
                    `/users/${expense.origin_user.id}/groups/${groupId}/members`
                );
                setMembers(membersResponse.data);

                setSelectedPayer(expense.origin_user.id || "");
                setExpenseName(expense.expense_name || "");
                setAmount(expense.amount || "");
                setShareMethod(expense.share_method || "PARTESIGUALES");
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        };

        fetchData();
    }, [expense, groupId]);

    const handleMemberSelection = (email) => {
        setSelectedMembers((prev) =>
            prev.includes(email)
                ? prev.filter((member) => member !== email)
                : [...prev, email]
        );
    };

    const calculateShares = () => {
        const totalAmount = parseFloat(amount);
        if (isNaN(totalAmount) || totalAmount <= 0) return;

        const selectedCount = selectedMembers.length;

        if (shareMethod === "PARTESIGUALES" && selectedCount > 0) {
            const equalShare = totalAmount / selectedCount;
            setShares(
                selectedMembers.reduce((acc, email) => {
                    acc[email] = equalShare;
                    return acc;
                }, {})
            );
        } else if (shareMethod === "PARTESDESIGUALES") {
            setShares(
                selectedMembers.reduce((acc, email) => {
                    acc[email] = shares[email] || 0;
                    return acc;
                }, {})
            );
        } else if (shareMethod === "PORCENTAJES") {
            const totalPercentage = selectedMembers.reduce((sum, email) => {
                return sum + (shares[email] || 0);
            }, 0);

            if (totalPercentage !== 100) {
                console.error("La suma de los porcentajes debe ser igual a 100.");
                return;
            }

            setShares(
                selectedMembers.reduce((acc, email) => {
                    const percentage = shares[email] || 0;
                    acc[email] = (totalAmount * percentage) / 100;
                    return acc;
                }, {})
            );
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

    const handleSubmit = async () => {
        const totalAmount = parseFloat(amount);

        if (isNaN(totalAmount) || totalAmount <= 0) return;
        if (!selectedPayer) return;
        if (selectedMembers.length === 0) return;

        const updatedExpense = {
            ...expense,
            amount: totalAmount,
            expense_name: expenseName,
            share_method: shareMethod,
            origin_user: { id: selectedPayer },
            shares: selectedMembers.map(email => ({
                destiny_user: { email },
                assignedAmount: shares[email] || 0,
            })),
            group: { id: groupId },
            expense_date: new Date().toISOString(),
        };

        try {
            const response = await axiosInstance.put(
                `/users/${expense.origin_user.id}/groups/${groupId}/expenses/${expense.id}`,
                updatedExpense
            );
            onSubmit(response.data);
            onClose();
        } catch (error) {
            console.error("Error al actualizar el gasto:", error);
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
                            <option value="">Selecciona un miembro</option>
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
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2"
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
                                        onChange={(e) => handleShareChange(email, e.target.value)}
                                        className="w-1/2 border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                            ))}
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
