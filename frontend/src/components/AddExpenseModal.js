import React, { useState, useEffect } from "react";
import axiosInstance from "../components/axiosInstance";
import { useTranslation } from "react-i18next"; // Importar useTranslation
import { getUserIdFromToken } from "./AuthUtils";
import {
    getErrorMessage,
    validateDistribution,
    sumDistribution,
} from "./validaciones/expendValidaciones"; // Importamos las validaciones existentes


const AddExpenseModal = ({ isOpen, onClose, groupId, onSubmit }) => {
    const { t } = useTranslation(); // Inicializar useTranslation
    const [members, setMembers] = useState([]); // Lista de miembros del grupo
    const [selectedPayer, setSelectedPayer] = useState(""); // Miembro pagador
    const [selectedMembers, setSelectedMembers] = useState([]); // Miembros seleccionados
    const [expenseName, setExpenseName] = useState("");
    const [amount, setAmount] = useState("");
    const [shareMethod, setShareMethod] = useState("PARTESIGUALES");
    const [shares, setShares] = useState({});
    const [errors, setErrors] = useState({});
    const [userId, setUserId] = useState(null); // Añadido para almacenar el userId obtenido del backend;

    // Obtener el userId desde el backend
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axiosInstance.get("/users/me"); // Suponemos que este endpoint devuelve el usuario autenticado
                setUserId(response.data.id); // Almacenamos el userId en el estado
            } catch (error) {
                console.error("Error al obtener el userId:", error);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        if (!groupId || !userId) return;

        const fetchMembers = async () => {
            try {
                const response = await axiosInstance.get(`/users/groups/${groupId}/members`);
                const membersData = response.data;
                setMembers(membersData);
                setSelectedPayer(userId); // Usamos el userId del backend como el pagador predeterminado
                setSelectedMembers(membersData.map((member) => member.email));
            } catch (error) {
                console.error("Error fetching members:", error);
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
        setSelectedPayer(userId); // Restablecemos el pagador al userId del backend
        setSelectedMembers(members.map((member) => member.email));
        setExpenseName("");
        setAmount("");
        setShareMethod("PARTESIGUALES");
        setShares({});
        setErrors({});
    };
    const validateForm = () => {
        const validationErrors = [];
        const regexDecimales = /^\d+(\.\d{1,2})?$/; // Permite números enteros o hasta dos decimales
        const totalAmount = parseFloat(amount);

        // Validar monto positivo
        if (!totalAmount || totalAmount <= 0) {
            validationErrors.push(t("amount_positive_error"));
        }
        if (!regexDecimales.test(amount)){
            validationErrors.push(t("bad_decimal"));
        }

        // Validaciones
        if (!expenseName || expenseName.length > 30) {
            validationErrors.push(t("exName_error"));
        }

        let finalShares = {};
        if (shareMethod === "PARTESIGUALES") {
            const equalShare = totalAmount / selectedMembers.length;
            finalShares = selectedMembers.reduce((acc, email) => {
                acc[email] = parseFloat(equalShare.toFixed(2));
                return acc;
            }, {});
        } else if (shareMethod === "PARTESDESIGUALES") {
            const totalShares = Object.values(shares).reduce((sum, share) => sum + share, 0);
            if (totalShares !== totalAmount) {
                validationErrors.push(t("shares_sum_error"));
            }
        } else if (shareMethod === "PORCENTAJES") {
            const totalPercentage = Object.values(shares).reduce((sum, percentage) => sum + percentage, 0);
            if (totalPercentage !== 100) {
                validationErrors.push(t("percentages_sum_error"));
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
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
            shares: finalShares,
        };

        // Enviar los datos al backend
        onSubmit(data);

        onClose();
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 max-h-[70vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Crear Nuevo Gasto</h2>
                <form>
                    {/* Selector: Pagador */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Pagador</label>
                        <select
                            value={selectedPayer}
                            onChange={(e) => setSelectedPayer(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        >
                            <option value="">{t("select_member")}</option>
                            {members.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name} {member.surname}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Checkboxes: Selección de miembros */}
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

                    {/* Input: Nombre del gasto */}
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

                    {/* Input: Cantidad Total */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">{t("total_amount")}</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        />
                        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                    </div>

                    {/* Selector: Método de Compartición */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Método de División</label>
                        <select
                            value={shareMethod}
                            onChange={(e) => setShareMethod(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        >
                            <option value="PARTESIGUALES">{t("equal_shares")}</option>
                            <option value="PARTESDESIGUALES">{t("unequal_shares")}</option>
                            <option value="PORCENTAJES">{t("percentages")}</option>
                        </select>
                    </div>
                </form>

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

                {/* Botones */}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={handleClose}
                        className="bg-gray-300 px-4 py-2 rounded-md"
                    >
                        {t("close")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-sky-500 hover:bg-cyan-700 text-white px-4 py-2 rounded-md"
                    >
                        {t("submit")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddExpenseModal;
