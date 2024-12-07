import React from 'react';
import ExpenseCard from './ExpenseCard';
import ExpenseDate from './ExpenseDate';

function ExpenseList({ expenses }) {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="container mx-auto px-6 pb-24">
                {expenses.map((expense, index) => (
                    <div key={expense.id}>
                        {/* Mostrar la fecha solo si es el primer gasto de un grupo por fecha */}
                        {(index === 0 || expense.expense_date !== expenses[index - 1].expense_date) && (
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