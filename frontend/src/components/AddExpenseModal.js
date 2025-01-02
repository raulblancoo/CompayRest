import React, { useState, useEffect } from "react";
import axiosInstance from "../components/axiosInstance";
import { getUserIdFromToken } from "./AuthUtils";

const AddExpenseModal = ({ isOpen, onClose, groupId, onSubmit }) => {
    const [members, setMembers] = useState([]);
    const [selectedPayer, setSelectedPayer] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [expenseName, setExpenseName] = useState("");
    const [amount, setAmount] = useState("");
    const [shareMethod, setShareMethod] = useState("PARTESIGUALES");
    const [shares, setShares] = useState({});
    const [errors, setErrors] = useState({});

    const userId = getUserIdFromToken();

    useEffect(() => {
        if (!groupId) return;

        const fetchMembers = async () => {
            try {
                const response = await axiosInstance.get(`/users/${userId}/groups/${groupId}/members`);
                const membersData = response.data;
                setMembers(membersData);
                setSelectedPayer(userId);
                setSelectedMembers(membersData.map((member) => member.email));
            } catch (error) {
                console.error("Error al cargar miembros del grupo:", error);
            }
        };

        fetchMembers();
    }, [groupId, userId]);

    const handleMemberSelection = (email) => {
        setSelectedMembers((prev) =>
            prev.includes(email)
                ? prev.filter((member) => member !== email)
                : [...prev, email]
        );
    };

    const handleShareChange = (email, value) => {
        setShares((prev) => ({
            ...prev,
            [email]: parseFloat(value),
        }));
    };

    const resetForm = () => {
        setSelectedPayer(userId);
        setSelectedMembers(members.map((member) => member.email));
        setExpenseName("");
        setAmount("");
        setShareMethod("PARTESIGUALES");
        setShares({});
        setErrors({});
    };

    const handleSubmit = () => {
        const totalAmount = parseFloat(amount);
        const newErrors = {};

        if (!expenseName || expenseName.length > 30) {
            newErrors.expenseName = "El nombre del gasto no puede tener más de 30 caracteres.";
        }

        if (isNaN(totalAmount) || totalAmount <= 0) {
            newErrors.amount = "La cantidad del pago debe ser positiva.";
        }

        if (shareMethod === "PARTESDESIGUALES") {
            const totalShares = Object.values(shares).reduce((sum, share) => sum + share, 0);
            if (totalShares !== totalAmount) {
                newErrors.shares = "La suma de la distribución debe coincidir con la cantidad total.";
            }
        } else if (shareMethod === "PORCENTAJES") {
            const totalPercentage = Object.values(shares).reduce((sum, percentage) => sum + percentage, 0);
            if (totalPercentage !== 100) {
                newErrors.shares = "La suma de los porcentajes debe ser igual a 100.";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        let finalShares = { ...shares };
        if (shareMethod === "PORCENTAJES") {
            finalShares = Object.keys(shares).reduce((acc, email) => {
                acc[email] = (totalAmount * shares[email]) / 100;
                return acc;
            }, {});
        }

        const data = {
            amount: totalAmount,
            expense_name: expenseName,
            originUserId: selectedPayer,
            share_method: shareMethod,
            shares: finalShares,
        };

        onSubmit(data);
        resetForm();
        onClose();
    };

    const handleClose = () => {
        setErrors({});
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 max-h-[70vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Crear Nuevo Gasto</h2>
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
                        <label className="block text-sm font-medium text-gray-700">Miembros del grupo</label>
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
                                    {member.name} {member.surname}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nombre del Gasto</label>
                        <input
                            type="text"
                            value={expenseName}
                            onChange={(e) => setExpenseName(e.target.value)}
                            className={`w-full border ${errors.expenseName ? "border-red-500" : "border-gray-300"} rounded-md p-2 mt-1`}
                        />
                        {errors.expenseName && <p className="text-red-500 text-sm mt-1">{errors.expenseName}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Cantidad total</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={`w-full border ${errors.amount ? "border-red-500" : "border-gray-300"} rounded-md p-2 mt-1`}
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
                </form>

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

export default AddExpenseModal;
