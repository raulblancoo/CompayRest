import React, { useState, useEffect } from 'react';
import ExpenseHeader from '../components/ExpenseHeader';
import ExpenseUnderHeader from '../components/ExpenseUnderHeader';
import ExpenseList from "../components/ExpenseList";
import AddMemberModal from "../components/AddMemberModal"; // Importamos el modal
import { useParams } from "react-router-dom";
import AddExpenseModal from "../components/AddExpenseModal";

export function Expense() {
    const { idGroup } = useParams(); // Obtenemos el id del grupo desde la URL
    const [expenses, setExpenses] = useState([]); // Estado para los gastos
    const [loading, setLoading] = useState(true); // Estado para indicar si los datos están cargando
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);

    const handleCreateExpense = async (newExpense) => {
        try {
            const response = await fetch(
                `http://localhost:8080/users/1/groups/${idGroup}/expenses`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newExpense),
                }
            );

            if (!response.ok) {
                throw new Error("Error al crear el gasto");
            }

            const createdExpense = await response.json();
            setExpenses((prev) => [...prev, createdExpense]);
            setExpenseModalOpen(false);
        } catch (error) {
            console.error("Error creando el gasto:", error);
            alert("Error al crear el gasto");
        }
    };

    useEffect(() => {
        const fetchExpenses = async () => {
            const url = `http://localhost:8080/users/1/groups/${idGroup}/expenses`;

            try {
                const response = await fetch(url);

                if (response.status === 204) {
                    setExpenses([]); // No hay contenido
                } else if (response.ok) {
                    const data = await response.json();
                    setExpenses(data);
                } else {
                    throw new Error("Error al obtener los datos");
                }
            } catch (error) {
                console.error("Error:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [idGroup]);

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