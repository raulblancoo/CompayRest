import React, { useState, useEffect } from 'react';
import ExpenseCard from './ExpenseCard';
import ExpenseDate from './ExpenseDate';
import { format } from 'date-fns';

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

    // Ordenar las expenses primero por fecha descendente y luego por hora descendente
    const sortedExpenses = [...expenses].sort((a, b) => {
        const dateA = Array.isArray(a.expense_date)
            ? new Date(
                a.expense_date[0],
                a.expense_date[1] - 1,
                a.expense_date[2],
                a.expense_date[3] || 0,
                a.expense_date[4] || 0,
                a.expense_date[5] || 0,
                Math.floor((a.expense_date[6] || 0) / 1000000) // Convertir nanosecond a millisecond
            )
            : new Date(a.expense_date);
        const dateB = Array.isArray(b.expense_date)
            ? new Date(
                b.expense_date[0],
                b.expense_date[1] - 1,
                b.expense_date[2],
                b.expense_date[3] || 0,
                b.expense_date[4] || 0,
                b.expense_date[5] || 0,
                Math.floor((b.expense_date[6] || 0) / 1000000) // Convertir nanosecond a millisecond
            )
            : new Date(b.expense_date);

        return dateB - dateA;
    });

    let lastDate = null;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="container mx-auto px-6 pb-32">
                {sortedExpenses.map((expense) => {
                    const expenseDate = Array.isArray(expense.expense_date)
                        ? new Date(
                            expense.expense_date[0],
                            expense.expense_date[1] - 1,
                            expense.expense_date[2],
                            expense.expense_date[3] || 0,
                            expense.expense_date[4] || 0,
                            expense.expense_date[5] || 0,
                            Math.floor((expense.expense_date[6] || 0) / 1000000) // Convertir nanosecond a millisecond
                        )
                        : new Date(expense.expense_date);

                    const expenseDay = format(expenseDate, 'yyyy-MM-dd');

                    let showDateHeader = false;

                    if (expenseDay !== lastDate) {
                        showDateHeader = true;
                        lastDate = expenseDay;
                    }

                    return (
                        <div key={expense.id}>
                            {showDateHeader && <ExpenseDate expense={expense} />}

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
                    );
                })}
            </div>
        </div>
    );
}

export default ExpenseList;
