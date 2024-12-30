import React, { useState, useEffect } from 'react';
import ExpenseCard from './ExpenseCard';
import ExpenseDate from './ExpenseDate';

function ExpenseList({ expenses, userId, groupId }) {
    const [expenseList, setExpenseList] = useState(expenses);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    const handleDeleteExpense = (expenseId) => {
        setExpenseList((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseId));
    };

    const toggleDropdown = (id) => {
        setOpenDropdownId((prevId) => (prevId === id ? null : id)); // Abrir/cerrar dropdown
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
                {expenseList.map((expense, index) => (
                    <div key={expense.id}>
                        {(index === 0 ||
                            new Date(expense.expense_date).toDateString() !==
                            new Date(expenses[index - 1].expense_date).toDateString()) && (
                            <ExpenseDate expense={expense} />
                        )}
                        <ExpenseCard
                            expense={expense}
                            userId={userId}
                            groupId={groupId}
                            isDropdownOpen={openDropdownId === expense.id}
                            toggleDropdown={toggleDropdown}
                            onDelete={handleDeleteExpense}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExpenseList;
