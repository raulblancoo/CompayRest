import React, { useState, useEffect } from "react";
import ExpenseUnderHeader from "../components/ExpenseUnderHeader";
import ExpenseList from "../components/ExpenseList";
import AddMemberModal from "../components/AddMemberModal";
import AddExpenseModal from "../components/AddExpenseModal";
import BizumsModal from "../components/BizumsModal"; // Importa el componente modal de bizums
import { useParams } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import { jwtDecode } from "jwt-decode";

export function Expense() {
    const { idGroup } = useParams();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
    const [isBizumsModalOpen, setBizumsModalOpen] = useState(false);
    const [bizums, setBizums] = useState([]);

    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return decoded.userId || decoded.id;
            } catch (err) {
                console.error("Error decoding token:", err);
                return null;
            }
        }
        return null;
    };

    const userId = getUserIdFromToken();

    useEffect(() => {
        const fetchExpenses = async () => {
            if (!userId) {
                setError("¡No hay usuario logueado!");
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get(
                    `/users/${userId}/groups/${idGroup}/expenses`
                );
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

    return (
        <>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Gastos del Grupo {idGroup}</h1>

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
                    <ExpenseList expenses={expenses} />
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
                onSubmit={handleCreateExpense}
            />

            <BizumsModal
                isOpen={isBizumsModalOpen}
                onClose={() => setBizumsModalOpen(false)}
                bizums={bizums}
            />
        </>
    );
}
