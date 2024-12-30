import React, { useState, useEffect } from "react";
import ExpenseHeader from "../components/ExpenseHeader"; // Importamos el componente ExpenseHeader
import ExpenseUnderHeader from "../components/ExpenseUnderHeader";
import ExpenseList from "../components/ExpenseList";
import AddMemberModal from "../components/AddMemberModal";
import BizumsModal from "../components/BizumsModal"; // Importa el componente modal de bizums
import { useParams } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import { getUserIdFromToken } from "../components/AuthUtils";
import AddExpenseModal from "../components/AddExpenseModal";

export function Expense() {
    const { idGroup } = useParams();
    const [group, setGroup] = useState(null); // Estado para guardar los datos del grupo
    const [expenses, setExpenses] = useState([]); // Estado para los gastos
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado de error
    const [isModalOpen, setModalOpen] = useState(false); // Modal de miembros
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false); // Modal de crear gasto
    const [isBizumsModalOpen, setBizumsModalOpen] = useState(false); // Modal de bizums
    const [bizums, setBizums] = useState([]); // Estado para bizums

    const userId = getUserIdFromToken(); // Obtener el ID del usuario logueado

    // Fetch para obtener los datos del grupo
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

    // Fetch para obtener los gastos
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
                    setExpenses([]); // Si no hay contenido
                } else {
                    setExpenses(response.data); // Guardar los gastos
                }
            } catch (error) {
                console.error("Error al obtener los gastos:", error);
                setError("Error al obtener los datos");
            } finally {
                setLoading(false); // Finalizar la carga
            }
        };

        fetchExpenses();
    }, [idGroup, userId]);

    // Fetch para obtener los bizums
    const fetchBizums = async () => {
        try {
            const response = await axiosInstance.get(`/users/${userId}/groups/${idGroup}/bizums`);
            if (response.status === 204) {
                setBizums([]); // Si no hay bizums
            } else {
                setBizums(response.data); // Guardar los bizums
            }
            setBizumsModalOpen(true); // Abrir el modal
        } catch (error) {
            console.error("Error al obtener los bizums:", error);
            alert("Error al cargar los bizums");
        }
    };

    // Manejar eliminación de un gasto
    const handleDeleteExpense = (expenseId) => {
        setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseId));
    };

    // Manejar creación de un gasto
    const handleCreateExpense = async (newExpense) => {
        if (!userId) {
            alert("¡No hay usuario logueado!");
            return;
        }

        try {
            const response = await axiosInstance.post(`/users/${userId}/groups/${idGroup}/expenses`, newExpense);
            setExpenses((prev) => [...prev, response.data]); // Agregar el nuevo gasto
            setExpenseModalOpen(false); // Cerrar el modal
        } catch (error) {
            console.error("Error creando el gasto:", error);
            alert("Error al crear el gasto");
        }
    };

    return (
        <>
            <div>
                {/* Cabecera del grupo */}
                {group && <ExpenseHeader group={group} />}

                {/* Botones debajo de la cabecera */}
                <ExpenseUnderHeader
                    onAddMember={() => setModalOpen(true)} // Abrir modal de añadir miembro
                    onShowDebts={fetchBizums} // Mostrar bizums
                />

                {/* Mostrar estados de carga o error */}
                {loading && <p className="text-center">Loading...</p>}
                {!loading && error && <p className="text-center text-red-500">{error}</p>}
                {!loading && !error && expenses.length === 0 && (
                    <p className="text-center text-gray-500">De momento no hay contenido para este grupo.</p>
                )}
                {!loading && !error && expenses.length > 0 && (
                    <ExpenseList
                        expenses={expenses} // Pasar los gastos
                        userId={userId} // ID del usuario
                        groupId={idGroup} // ID del grupo
                        onDeleteExpense={handleDeleteExpense} // Manejar eliminación
                    />
                )}

                {/* Botón fijo para crear nuevo gasto */}
                <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2">
                    <button
                        onClick={() => setExpenseModalOpen(true)}
                        className="p-2 flex justify-center items-center rounded-full bg-sky-500 text-white px-6 py-3 mx-5 -mb-4 hover:bg-cyan-700 focus:outline-none focus:bg-blue-500"
                    >
                        Crear Nuevo Gasto
                    </button>
                </div>
            </div>

            {/* Modal para añadir miembro */}
            {isModalOpen && (
                <AddMemberModal
                    idGroup={idGroup}
                    onClose={() => setModalOpen(false)} // Cerrar modal
                />
            )}

            {/* Modal para crear gasto */}
            <AddExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setExpenseModalOpen(false)} // Cerrar modal
                groupId={idGroup}
                onSubmit={handleCreateExpense} // Crear gasto
            />

            {/* Modal para mostrar bizums */}
            <BizumsModal
                isOpen={isBizumsModalOpen}
                onClose={() => setBizumsModalOpen(false)} // Cerrar modal
                bizums={bizums} // Pasar los bizums
            />
        </>
    );
}
