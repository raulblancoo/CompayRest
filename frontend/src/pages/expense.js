import React, { useState, useEffect } from "react";
import ExpenseHeader from "../components/ExpenseHeader";
import ExpenseUnderHeader from "../components/ExpenseUnderHeader";
import ExpenseList from "../components/ExpenseList";
import AddMemberModal from "../components/AddMemberModal";
import BizumsModal from "../components/BizumsModal";
import { useParams } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import { getUserIdFromToken } from "../components/AuthUtils";
import AddExpenseModal from "../components/AddExpenseModal";
import EditExpenseModal from "../components/EditExpenseModal"; // Modal para editar

export function Expense() {
    const { idGroup } = useParams();
    const [group, setGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
    const [isBizumsModalOpen, setBizumsModalOpen] = useState(false);
    const [bizums, setBizums] = useState([]);
    const [editingExpense, setEditingExpense] = useState(null);

    const userId = getUserIdFromToken();

    useEffect(() => {
        const fetchGroupData = async () => {
            if (!userId) {
                setError("¡No hay usuario logueado!");
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get(`/users/${userId}/groups/${idGroup}`);
                setGroup(response.data);
            } catch (error) {
                console.error("Error al obtener los datos del grupo:", error);
                setError("Error al obtener los datos del grupo");
            }
        };

        fetchGroupData();
    }, [idGroup, userId]);

    useEffect(() => {
        const fetchExpenses = async () => {
            if (!userId) {
                setError("¡No hay usuario logueado!");
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get(`/users/${userId}/groups/${idGroup}/expenses`);
                if (response.status === 204) {
                    setExpenses([]);
                } else {
                    setExpenses(response.data);
                }
            } catch (error) {
                console.error("Error al obtener los gastos:", error);
                setError("Error al obtener los datos");
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [idGroup, userId]);

    const handleEditExpense = (updatedExpense) => {
        setExpenses((prev) =>
            prev.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense))
        );
        setEditingExpense(null);
    };

    return (
        <>
            <div>
                {group && <ExpenseHeader group={group} />}

                <ExpenseUnderHeader
                    onAddMember={() => setModalOpen(true)}
                    onShowDebts={() => console.log("Show debts")}
                />

                {loading && <p className="text-center">Loading...</p>}
                {!loading && error && <p className="text-center text-red-500">{error}</p>}
                {!loading && !error && expenses.length === 0 && (
                    <p className="text-center text-gray-500">
                        De momento no hay contenido para este grupo.
                    </p>
                )}
                {!loading && !error && expenses.length > 0 && (
                    <ExpenseList
                        expenses={expenses}
                        userId={userId}
                        groupId={idGroup}
                        onEditExpense={(expense) => setEditingExpense(expense)} // Pasar función al componente
                    />
                )}

                <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2">
                    <button
                        onClick={() => setExpenseModalOpen(true)}
                        className="p-2 flex justify-center items-center rounded-full bg-sky-500 text-white px-6 py-3 mx-5 -mb-4 hover:bg-cyan-700 focus:outline-none focus:bg-blue-500"
                    >
                        Crear Nuevo Gasto
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <AddMemberModal
                    idGroup={idGroup}
                    onClose={() => setModalOpen(false)}
                />
            )}

            <AddExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setExpenseModalOpen(false)}
                groupId={idGroup}
                onSubmit={(newExpense) => setExpenses((prev) => [...prev, newExpense])}
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
            />
        </>
    );
}
