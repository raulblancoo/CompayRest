import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";

const EditExpenseModal = ({ isOpen, onClose, groupId, expense, onSubmit }) => {
    const [members, setMembers] = useState([]);
    const [selectedPayer, setSelectedPayer] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [expenseName, setExpenseName] = useState("");
    const [amount, setAmount] = useState("");
    const [shareMethod, setShareMethod] = useState("PARTESIGUALES");
    const [shares, setShares] = useState([]);

    useEffect(() => {
        if (!expense || !expense.id || !groupId) return;

        const fetchData = async () => {
            try {
                // Fetch expense details
                const expenseResponse = await axiosInstance.get(
                    `/users/${expense.origin_user.id}/groups/${groupId}/expenses/${expense.id}`
                );


                // Extract emails from shares
                const emails = expenseResponse.data.shares.map(share => share.destiny_user.email);
                setSelectedMembers(emails);

                // Fetch group members
                const membersResponse = await axiosInstance.get(
                    `/users/${expense.origin_user.id}/groups/${groupId}/members`
                );
                setMembers(membersResponse.data);

                // Set initial values
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

    const handleSubmit = async () => {
        const updatedExpense = {
            ...expense,
            amount: parseFloat(amount),
            expense_name: expenseName,
            share_method: shareMethod,
            origin_user: { id: selectedPayer },
            shares: selectedMembers.map(email => ({ destiny_user: { email } })), // Map emails back to shares structure
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
                    {/* Pagador */}
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

                    {/* Miembros */}
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

                    {/* Nombre del gasto */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={expenseName}
                            onChange={(e) => setExpenseName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    {/* Cantidad */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    {/* Botones */}
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
