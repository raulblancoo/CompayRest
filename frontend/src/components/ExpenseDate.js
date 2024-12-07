import React from 'react';
import { format } from 'date-fns';

function ExpenseDate({ expense }) {
    const formattedDate = format(new Date(expense.expense_date), 'dd MMM yyyy'); // Formateamos la fecha

    return (
        <div className="flex items-center my-8">
            <hr className="flex-grow border-gray-300" />
            <span className="px-4 bg-white text-gray-500">{formattedDate}</span>
            <hr className="flex-grow border-gray-300" />
        </div>
    );
}

export default ExpenseDate;
