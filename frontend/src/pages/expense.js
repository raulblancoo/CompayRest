import React, { useState, useEffect } from 'react';
import ExpenseHeader from '../components/ExpenseHeader';
import ExpenseUnderHeader from '../components/ExpenseUnderHeader';
import ExpenseList from "../components/ExpenseList";
import AddMemberModal from "../components/AddMemberModal"; // Importamos el modal
import {useNavigate, useParams} from "react-router-dom";
import AddExpenseModal from "../components/AddExpenseModal";
import axiosInstance from "../components/axiosInstance";
import { jwtDecode } from 'jwt-decode';

export function Expense() {
    const { idGroup } = useParams(); // Obtenemos el id del grupo desde la URL
    const [expenses, setExpenses] = useState([]); // Estado para los gastos
    const [loading, setLoading] = useState(true); // Estado para indicar si los datos están cargando
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);

    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return decoded.userId || decoded.id; // AJUSTA SEGÚN LA ESTRUCTURA DE TU TOKEN
            } catch (err) {
                console.error("Error decoding token:", err);
                return null;
            }
        }
        return null;
    };

    const userId = getUserIdFromToken();
    const navigate = useNavigate();

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
                    setExpenses([]); // No hay contenido
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

                {/* Botones bajo el encabezado */}
                <ExpenseUnderHeader
                    onAddMember={() => setModalOpen(true)} // Abre el modal
                    onShowDebts={() => console.log("Mostrar deudas")} // Agrega tu lógica para mostrar deudas
                />

                {loading && <p className="text-center">Loading...</p>}
                {!loading && error && <p className="text-center text-red-500">{error}</p>}
                {!loading && !error && expenses.length === 0 && (
                    <p className="text-center text-gray-500">De momento no hay contenido para este grupo.</p>
                )}
                {!loading && !error && expenses.length > 0 && (
                    <ExpenseList expenses={expenses}/>
                )}

                {/* Botón siempre en la parte inferior de la pantalla */}
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
                    onClose={() => setModalOpen(false)} // Cierra el modal
                />
            )}

            <AddExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setExpenseModalOpen(false)}
                groupId={idGroup}
                onSubmit={handleCreateExpense}
            />
        </>
    );
}