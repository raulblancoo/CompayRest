import React, { useState, useEffect } from 'react';
import ExpenseCard from './ExpenseCard';
import ExpenseDate from './ExpenseDate';

function ExpenseList({ expenses, userId, groupId, onEditExpense, onDeleteExpense }) {
    const [openDropdownId, setOpenDropdownId] = useState(null); // Estado para manejar qué dropdown está abierto

    const toggleDropdown = (id) => {
        setOpenDropdownId((prevId) => (prevId === id ? null : id));
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest('.relative')) {
            setOpenDropdownId(null); // Cerrar el dropdown si el clic fue fuera
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="container mx-auto px-6 pb-32">
                {expenses.map((expense, index) => (
                    <div key={expense.id}>
                        {/* Mostrar la fecha solo si es diferente a la anterior */}
                        {(index === 0 || new Date(expense.expense_date).toDateString() !== new Date(expenses[index - 1].expense_date).toDateString()) && (
                            <ExpenseDate expense={expense} />
                        )}

                        {/* Renderizar la tarjeta de gasto */}
                        <ExpenseCard
                            expense={expense}
                            userId={userId}
                            groupId={groupId}
                            isDropdownOpen={openDropdownId === expense.id} // Verificar si este dropdown está abierto
                            toggleDropdown={toggleDropdown} // Pasar función para manejar el estado
                            onDelete={onDeleteExpense} // Pasar la función del padre
                            onEdit={onEditExpense} // Pasar función para manejar edición
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExpenseList;
