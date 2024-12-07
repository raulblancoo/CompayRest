import React, { useState, useEffect } from 'react';
import ExpenseHeader from '../components/ExpenseHeader';
import ExpenseUnderHeader from '../components/ExpenseUnderHeader';
import ExpenseList from "../components/ExpenseList";
import {useParams} from "react-router-dom";

export function Expense() {
    const { idGroup } = useParams();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Define la URL de la API usando el parámetro idGroup
        const url = `http://localhost:8080/users/1/groups/${idGroup}/expenses`;

        // Haz la petición
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener los datos");
                }
                return response.json();
            })
            .then((data) => {
                setExpenses(data); // Guarda los datos en el estado
                setLoading(false);
            })
            .catch((error) => console.error("Error:", error));
    }, [idGroup]);


    if (loading) return <p>Cargando...</p>;

    return (
        <div>
            <h1>Gastos del Grupo {idGroup}</h1>
             {/*<ExpenseHeader group={group} />*/}
            <ExpenseUnderHeader />

            {/* Mostrar la lista de gastos */}
            <ExpenseList expenses={expenses} />
        </div>
    );
}
