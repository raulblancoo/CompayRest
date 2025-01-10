import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { useTranslation } from "react-i18next";


const EditExpenseModal = ({ isOpen, onClose, groupId, expense, onSubmit }) => {
    const { t } = useTranslation();
    const [members, setMembers] = useState([]);
    const [selectedPayer, setSelectedPayer] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [expenseName, setExpenseName] = useState("");
    const [amount, setAmount] = useState("");
    const [shareMethod, setShareMethod] = useState("PARTESIGUALES");
    const [shares, setShares] = useState({});
    const [errors, setErrors] = useState({});
    let finalShares = {};

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
                    if(expenseData.share_method === "PORCENTAJES") {
                        acc[share.destiny_user.email] = Math.ceil((share.assignedAmount * 100) / expenseData.amount) || 0;
                    } else {
                        acc[share.destiny_user.email] = share.assignedAmount || 0;
                    }
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

    const validateForm = () => {
        const validationErrors = [];
        const regexDecimales = /^\d+(\.\d{1,2})?$/; // Permite números enteros o hasta dos decimales
        const totalAmount = parseFloat(amount);

        // Validar monto positivo
        if (!totalAmount ) {
            validationErrors.push(t("amount_empty"));
        }else if(totalAmount <= 0){
            validationErrors.push(t("amount_positive_error"));
        }
        else if (!regexDecimales.test(amount)){
            validationErrors.push(t("bad_decimal"));
        }

        // Validaciones
        if (!expenseName) {
            validationErrors.push(t("exName_error"));
        }else if(expenseName.length > 30){
            validationErrors.push(t("exName_toolong"));

        }

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
            }else {
                finalShares = { ...shares };
            }
        } else if (shareMethod === "PORCENTAJES") {
            const totalPercentage = Object.values(shares).reduce((sum, percentage) => sum + percentage, 0);
            if (totalPercentage !== 100) {
                validationErrors.push(t("percentages_sum_error"));
            }else {
                finalShares = selectedMembers.reduce((acc, email) => {
                    acc[email] = parseFloat(((totalAmount * shares[email]) / 100).toFixed(2));
                    return acc;
                }, {});
            }
        }

        console.log(finalShares)

        setErrors(validationErrors);
        return validationErrors.length === 0; // Retorna true si no hay errores
    };

    const handleSubmit = async () => {

        if(!validateForm()) return;

        const totalAmount = parseFloat(amount);

        const updatedExpense = {
            ...expense,
            amount: totalAmount,
            expense_name: expenseName,
            share_method: shareMethod,
            origin_user: { id: selectedPayer },
            shares: selectedMembers.map(email => ({
                destiny_user: { email },
                assignedAmount: finalShares[email],
            })),
            group: { id: groupId },
            expense_date: new Date().toISOString(),
        };

        try {
            const response = await axiosInstance.put(
                `/users/groups/${groupId}/expenses/${expense.id}`,
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
                <h2 className="text-xl font-semibold mb-4">{t("expense_edit")}</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">{t("payer")}</label>
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
                        <label className="block text-sm font-medium text-gray-700">{t("group_members")}</label>
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
                        <label className="block text-sm font-medium text-gray-700">{t("expense_name")}</label>
                        <input
                            type="text"
                            value={expenseName}
                            onChange={(e) => setExpenseName(e.target.value)}
                            className={`w-full border ${errors.expenseName ? "border-red-500" : "border-gray-300"} rounded-md p-2`}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">{t("total_amount")}</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={`w-full border ${errors.amount ? "border-red-500" : "border-gray-300"} rounded-md p-2`}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">{t("share_method")}</label>
                        <select
                            value={shareMethod}
                            onChange={(e) => setShareMethod(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        >
                            <option value="PARTESIGUALES">{t("equal_shares")}</option>
                            <option value="PARTESDESIGUALES">{t("unequal_shares")}</option>
                            <option value="PORCENTAJES">{t("porcentages")}</option>
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
                        </div>
                    )}

                    {errors.length > 0 && (
                        <div
                            id="divErrores"
                            className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400"
                            role="alert"
                        >
                            <div>
                                <p className="font-medium">{t("errors")}</p>
                                <ul className="mt-1.5 list-disc list-inside pl-5">
                                    {errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
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
