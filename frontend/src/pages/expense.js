import React, { useState, useEffect } from "react";
import ExpenseHeader from "../components/ExpenseHeader";
import ExpenseUnderHeader from "../components/ExpenseUnderHeader";
import ExpenseList from "../components/ExpenseList";
import AddMemberModal from "../components/AddMemberModal";
import BizumsModal from "../components/BizumsModal";
import { useParams } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import AddExpenseModal from "../components/AddExpenseModal";
import EditExpenseModal from "../components/EditExpenseModal"; // Modal para editar
import { useTranslation } from "react-i18next";

export function Expense() {
    const { t } = useTranslation();
    const { idGroup } = useParams();
    const [group, setGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
    const [isBizumsModalOpen, setBizumsModalOpen] = useState(false);
    const [bizums, setBizums] = useState([]);
    const [members, setMembers] = useState([]); // Estado para los miembros del grupo
    const [groupCurrency, setGroupCurrency] = useState(""); // Estado para la moneda del grupo
    const [editingExpense, setEditingExpense] = useState(null);
    const [userId, setUserId] = useState(null); // Estado para almacenar el userId

    // Obtener el userId desde el backend
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axiosInstance.get("/users/me"); // Suponemos que este endpoint devuelve el usuario autenticado
                setUserId(response.data.id); // Almacenamos el userId en el estado
            } catch (error) {
                console.error(t("errorFetchingUser"), error);
                setError(t("errorFetchingUser"));
            }
        };

        fetchUserId();
    }, [t]);

    useEffect(() => {
        const fetchGroupData = async () => {
            if (!userId) return; // Esperamos a que el userId esté disponible

            try {
                const response = await axiosInstance.get(`/users/groups/${idGroup}`);
                setGroup(response.data);
                setGroupCurrency(response.data.currency); // Establecer la moneda del grupo
            } catch (error) {
                console.error(t("errorFetchingGroups"), error);
                setError(t("errorFetchingGroups"));
            }
        };

        fetchGroupData();
    }, [idGroup, userId, t]);

    useEffect(() => {
        const fetchExpenses = async () => {
            if (!userId) return; // Esperamos a que el userId esté disponible

            try {
                const response = await axiosInstance.get(`/users/groups/${idGroup}/expenses`);
                if (response.status === 204) {
                    setExpenses([]);
                } else {
                    setExpenses(response.data);
                }
            } catch (error) {
                console.error(t("errorFetchingExpenses"), error);
                setError(t("errorFetchingExpenses"));
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [idGroup, userId, t]);

    // Fetch para obtener los miembros del grupo
    useEffect(() => {
        const fetchMembers = async () => {
            if (!userId) return; // Esperamos a que el userId esté disponible

            try {
                const response = await axiosInstance.get(
                    `/users/groups/${idGroup}/members`
                );
                setMembers(response.data);
            } catch (error) {
                console.error(t("errorFetchingMembers"), error);
            }
        };

        fetchMembers();
    }, [idGroup, userId, t]);

    const fetchBizums = async () => {
        try {
            const response = await axiosInstance.get(
                `/users/groups/${idGroup}/bizums`
            );
            if (response.status === 204) {
                setBizums([]);
            } else {
                setBizums(response.data);
            }
            setBizumsModalOpen(true);
        } catch (error) {
            console.error(t("errorFetchingBizums"), error);
            alert(t("errorFetchingBizums"));
        }
    };

    const handleDeleteExpense = (expenseId) => {
        setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseId));
    };

    const handleCreateExpense = async (newExpense) => {
        if (!userId) {
            alert(t("errorFetchingUser"));
            return;
        }

        try {
            const response = await axiosInstance.post(
                `/users/groups/${idGroup}/expenses`,
                newExpense
            );
            console.log(t("addExpense"), response.data);
            setExpenses((prev) => [...prev, response.data]); // Actualiza el estado de manera inmutable
            setExpenseModalOpen(false);
        } catch (error) {
            console.error(t("errorCreatingExpense"), error);
            alert(t("errorCreatingExpense"));
        }
    };

    const handleEditExpense = (updatedExpense) => {
        setExpenses((prev) =>
            prev.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense))
        );
        setEditingExpense(null);
    };

    // Nueva función para actualizar los miembros después de añadir
    const handleMembersAdded = async () => {
        try {
            const response = await axiosInstance.get(`/users/groups/${idGroup}/members`);
            setMembers(response.data);
        } catch (error) {
            console.error(t("errorUpdatingMembers"), error);
        }
    };

    return (
        <>
            <div>
                {/* Cabecera del grupo */}
                {group && <ExpenseHeader group={group} />}

                {/* Botones debajo de la cabecera */}
                <ExpenseUnderHeader
                    onAddMember={() => setModalOpen(true)}
                    onShowDebts={fetchBizums}
                />

                {loading && <p className="text-center">{t("loading")}</p>}
                {!loading && error && <p className="text-center text-red-500">{error}</p>}
                {!loading && !error && expenses.length === 0 && (
                    <p className="text-center text-gray-500">
                        {t("noExpenses")}
                    </p>
                )}
                {!loading && !error && expenses.length > 0 && (
                    <ExpenseList
                        expenses={expenses}
                        userId={userId}
                        groupId={idGroup}
                        onEditExpense={(expense) => setEditingExpense(expense)} // Pasar función para editar
                        onDeleteExpense={handleDeleteExpense} // Pasar función para eliminar
                    />
                )}

                <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2">
                    <button
                        onClick={() => setExpenseModalOpen(true)}
                        className="p-2 flex justify-center items-center rounded-full bg-sky-500 text-white px-6 py-3 mx-5 -mb-4 hover:bg-cyan-700 focus:outline-none focus:bg-blue-500"
                    >
                        {t("createNewExpense")}
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <AddMemberModal
                    idGroup={idGroup}
                    onClose={() => setModalOpen(false)}
                    groupMembers={members}
                    onMembersAdded={handleMembersAdded} // Pasar la función de callback
                />
            )}

            <AddExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setExpenseModalOpen(false)}
                groupId={idGroup}
                onSubmit={handleCreateExpense}
            />

            {editingExpense && (
                <EditExpenseModal
                    isOpen={!!editingExpense}
                    onClose={() => setEditingExpense(null)}
                    groupId={idGroup}
                    expense={editingExpense}
                    onSubmit={handleEditExpense}
                />
            )}

            <BizumsModal
                isOpen={isBizumsModalOpen}
                onClose={() => setBizumsModalOpen(false)}
                bizums={bizums}
                members={members}
                currency={groupCurrency}
            />
        </>
    );

}

export default Expense;
