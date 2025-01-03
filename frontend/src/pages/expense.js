import React, {useState, useEffect} from "react";
import ExpenseHeader from "../components/ExpenseHeader";
import ExpenseUnderHeader from "../components/ExpenseUnderHeader";
import ExpenseList from "../components/ExpenseList";
import AddMemberModal from "../components/AddMemberModal";
import BizumsModal from "../components/BizumsModal";
import {useParams} from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import {getUserIdFromToken} from "../components/AuthUtils";
import AddExpenseModal from "../components/AddExpenseModal";
import EditExpenseModal from "../components/EditExpenseModal"; // Modal para editar

export function Expense() {
    const {idGroup} = useParams();
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
                setGroupCurrency(response.data.currency); // Establecer la moneda del grupo
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

    // Fetch para obtener los miembros del grupo
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axiosInstance.get(
                    `/users/${userId}/groups/${idGroup}/members`
                );
                setMembers(response.data);
            } catch (error) {
                console.error("Error al obtener los miembros del grupo:", error);
            }
        };

        fetchMembers();
    }, [idGroup, userId]);

    const fetchBizums = async () => {
        try {
            const response = await axiosInstance.get(
                `/users/${userId}/groups/${idGroup}/bizums`
            );
            if (response.status === 204) {
                setBizums([]);
            } else {
                setBizums(response.data);
            }
            setBizumsModalOpen(true);
        } catch (error) {
            console.error("Error al obtener los bizums:", error);
            alert("Error al cargar los bizums");
        }
    };

    const handleDeleteExpense = (expenseId) => {
        setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseId));
    };

    const handleCreateExpense = async (newExpense) => {
        if (!userId) {
            alert("¡No hay usuario logueado!");
            return;
        }

        try {
            const response = await axiosInstance.post(
                `/users/${userId}/groups/${idGroup}/expenses`,
                newExpense
            );
            setExpenses((prev) => [...prev, response.data]);
            setExpenseModalOpen(false);
        } catch (error) {
            console.error("Error creando el gasto:", error);
            alert("Error al crear el gasto");
        }
    };

    const handleEditExpense = (updatedExpense) => {
        setExpenses((prev) =>
            prev.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense))
        );
        setEditingExpense(null);
    };

    return (
        <>
            <div>
                {/* Cabecera del grupo */}
                {group && <ExpenseHeader group={group}/>}

                {/* Botones debajo de la cabecera */}
                <ExpenseUnderHeader
                    onAddMember={() => setModalOpen(true)}
                    onShowDebts={fetchBizums}
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
                    groupMembers={members}
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
                    onSubmit={(updatedExpense) => {
                        setExpenses((prevExpenses) =>
                            prevExpenses.map((expense) =>
                                expense.id === updatedExpense.id ? updatedExpense : expense
                            )
                        );
                    }}
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
