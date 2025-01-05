import React from 'react';
import { format } from 'date-fns';

function ExpenseDate({ expense }) {
    const { expense_date } = expense;
    let date;

    if (Array.isArray(expense_date)) {
        // Desestructurar el array con valores predeterminados para hora, minuto, segundo y nanosegundo
        const [
            year,
            month,
            day,
            hour = 0,
            minute = 0,
            second = 0,
            nanosecond = 0
        ] = expense_date;

        // Convertir nanosecond a millisecond
        const millisecond = Math.floor(nanosecond / 1000000);

        // Crear el objeto Date (mes es 0-indexado en JavaScript)
        date = new Date(year, month - 1, day, hour, minute, second, millisecond);
    } else {
        // Si no es un array, intentar crear el Date directamente
        date = new Date(expense_date);
    }

    // Verificar si la fecha es válida
    const isValidDate = !isNaN(date.getTime());

    // Formatear la fecha si es válida
    const formattedDate = isValidDate
        ? format(date, 'dd MMM yyyy')
        : 'Fecha inválida';

    return (
        <div className="flex items-center my-8">
            <hr className="flex-grow border-gray-300" />
            <span className="px-4 bg-white text-gray-500">{formattedDate}</span>
            <hr className="flex-grow border-gray-300" />
        </div>
    );
}

export default ExpenseDate;
