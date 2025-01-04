import React, { useState, useEffect } from "react";
import axiosInstance from "../components/axiosInstance";
import { getUserIdFromToken } from "./AuthUtils";
import {
    getErrorMessage,
    validateDistribution,
    sumDistribution,
} from "./validaciones/expendValidaciones"; // Importamos las validaciones existentes

const AddExpenseModal = ({ isOpen, onClose, groupId, onSubmit }) => {
    const [members, setMembers] = useState([]); // Lista de miembros del grupo
    const [selectedPayer, setSelectedPayer] = useState(""); // Miembro pagador
    const [selectedMembers, setSelectedMembers] = useState([]); // Miembros seleccionados
    const [expenseName, setExpenseName] = useState("");
    const [amount, setAmount] = useState("");
    const [shareMethod, setShareMethod] = useState("PARTESIGUALES");
    const [shares, setShares] = useState({});
    const [errors, setErrors] = useState([]); // Lista de errores

    const userId = getUserIdFromToken();

    useEffect(() => {
        if (!groupId) return;

        const fetchMembers = async () => {
            try {
                const response = await axiosInstance.get(`/users/${userId}/groups/${groupId}/members`);
                setMembers(response.data);
            } catch (error) {
                console.error("Error fetching members:", error);
            }
        };

        fetchMembers();
    }, [groupId]);

    const handleMemberSelection = (email) => {
        setSelectedMembers((prev) =>
            prev.includes(email) ? prev.filter((member) => member !== email) : [...prev, email]
        );
    };

    const validateForm = () => {
        const validationErrors = [];

        // Validar monto positivo
        if (parseFloat(amount) <= 0) {
            validationErrors.push(getErrorMessage("amountZero", "sp"));
        }

        // Validar campos vacíos
        if (
            !selectedPayer ||
            !amount ||
            !expenseName ||
            selectedMembers.length === 0 ||
            !validateDistribution(Object.values(shares))
        ) {
            validationErrors.push(getErrorMessage("emptyFields", "sp"));
        }

        // Validar método PARTESDESIGUALES
        if (
            shareMethod === "PARTESDESIGUALES" &&
            sumDistribution(Object.values(shares)) !== parseFloat(amount)
        ) {
            validationErrors.push(getErrorMessage("distributionMismatch", "sp"));
        }

        // Validar método PORCENTAJES
        if (
            shareMethod === "PORCENTAJES" &&
            sumDistribution(Object.values(shares)) !== 100
        ) {
            validationErrors.push(getErrorMessage("percentMismatch", "sp"));
        }

        // Validar método de división
        if (
            !["PARTESIGUALES", "PARTESDESIGUALES", "PORCENTAJES"].includes(
                shareMethod
            )
        ) {
            validationErrors.push(getErrorMessage("invalidDivision", "sp"));
        }

        setErrors(validationErrors);
        return validationErrors.length === 0; // Retorna true si no hay errores
    };

    const handleSubmit = () => {
        if (!validateForm()) return; // Detenemos el envío si hay errores

        const totalAmount = parseFloat(amount);

        // Preparar los datos para enviar
        const data = {
            amount: totalAmount,
            expense_name: expenseName,
            originUserId: selectedPayer,
            share_method: shareMethod,
            shares,
        };

        onSubmit(data);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-xl font-semibold mb-4">Crear Nuevo Gasto</h2>
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
                                    {member.name} {member.surname} ({member.email})
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
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Cantidad total</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        />
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
                </form>

                {errors.length > 0 && (
                    <div
                        id="divErrores"
                        className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50  dark:text-red-400"
                        role="alert"
                    >
                        <div>
                            <p className="font-medium">Errores:</p>
                            <ul className="mt-1.5 list-disc list-inside pl-5">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-md">
                        Cerrar
                    </button>
                    <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddExpenseModal;
