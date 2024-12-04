import React, { useState, useEffect } from 'react';
import ExpenseHeader from '../components/ExpenseHeader';
import ExpenseUnderHeader from '../components/ExpenseUnderHeader';
import ExpenseList from "../components/ExpenseList";

export function Expense() {
    const expenses = [
        {
            id: 1,
            expense_date: '2024-12-01T00:00:00Z', // Ejemplo de fecha
            amount: 50,
            expense_name: 'Comida',
            originUser: { username: 'Juan', avatarURL: '/images/juan.jpg' },
            group: { currency: 'EURO' },
        },
    ];

    return (
        <>
            {/* Puedes descomentar y usar ExpenseHeader si es necesario */}
            {/* <ExpenseHeader group={group} /> */}
            <ExpenseUnderHeader />

            {/* Mostrar la lista de gastos */}
            <ExpenseList expenses={expenses} />
        </>
    );
}
