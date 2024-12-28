import React from 'react';
import ExpenseCard from './ExpenseCard';
import ExpenseDate from './ExpenseDate';

function ExpenseList({ expenses }) {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="container mx-auto px-6 pb-32">
                {expenses.map((expense, index) => (
                    <div key={expense.id}>
                        {/* Mostrar la fecha solo si es diferente a la anterior */}
                        {(index === 0 || new Date(expense.expense_date).toDateString() !== new Date(expenses[index - 1].expense_date).toDateString()) && (
                            <div>
                                <ExpenseDate expense={expense} />
                            </div>
                        )}

                        {/* Renderizar la tarjeta de gasto */}
                        <div className="mt-8 h-100">
                            <ExpenseCard expense={expense} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExpenseList;
