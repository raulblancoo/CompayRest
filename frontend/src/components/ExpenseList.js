import React, { useState } from 'react';
import ExpenseCard from './ExpenseCard';
import ExpenseDate from './ExpenseDate';

function ExpenseList({ expenses, userId, groupId }) {
    const [expenseList, setExpenseList] = useState(expenses);

    const handleDeleteExpense = (expenseId) => {
        // Actualizar la lista de gastos eliminando el gasto con el ID especificado
        setExpenseList((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseId));
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="container mx-auto px-6 pb-32">
                {expenseList.map((expense, index) => (
                    <div key={expense.id}>
                        {/* Mostrar la fecha solo si es el primer gasto de un grupo por fecha */}
                        {(index === 0 || expense.expense_date !== expenseList[index - 1].expense_date) && (
                            <div>
                                <ExpenseDate expense={expense} />
                            </div>
                        )}

                        {/* Renderizar la tarjeta de gasto */}
                        <div className="mt-8 h-100">
                            <ExpenseCard
                                expense={expense}
                                userId={userId}
                                groupId={groupId}
                                onDelete={handleDeleteExpense}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExpenseList;
