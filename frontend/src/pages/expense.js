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
        const url = `http://localhost:8080/users/1/groups/${idGroup}/expenses`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener los datos");
                }
                return response.json();
            })
            .then((data) => {
                setExpenses(data);
                setLoading(false);
            })
            .catch((error) => console.error("Error:", error));
    }, [idGroup]);

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Gastos del Grupo {idGroup}</h1>

            {/* Componente de encabezado */}
            {/* <ExpenseHeader group={group} /> */}

            {/* Botones bajo el encabezado */}
            <ExpenseUnderHeader
                onAddMember={() => setModalOpen(true)} // Abre el modal
                onShowDebts={() => console.log("Mostrar deudas")} // Agrega tu lógica para mostrar deudas
            />

            {/* Lista de gastos */}
            <ExpenseList expenses={expenses}/>

            {/* Modal para añadir miembros */}
            {isModalOpen && (
                <AddMemberModal
                    idGroup={idGroup}
                    onClose={() => setModalOpen(false)} // Cierra el modal
                />
            )}

            <button
                onClick={() => setExpenseModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
                Crear Nuevo Gasto
            </button>

            <AddExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setExpenseModalOpen(false)}
                groupId={idGroup}
                onSubmit={handleCreateExpense}
            />
        </div>
    );
}
