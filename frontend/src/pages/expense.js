// import React, { useState, useEffect } from 'react';
// import ExpenseHeader from '../components/ExpenseHeader';
// import ExpenseUnderHeader from '../components/ExpenseUnderHeader';
// import ExpenseList from "../components/ExpenseList";
// import {useParams} from "react-router-dom";
//
// export function Expense() {
//     const { idGroup } = useParams();
//     const [expenses, setExpenses] = useState([]);
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         // Define la URL de la API usando el parámetro idGroup
//         const url = `http://localhost:8080/users/1/groups/${idGroup}/expenses`;
//
//         // Haz la petición
//         fetch(url)
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error("Error al obtener los datos");
//                 }
//                 return response.json();
//             })
//             .then((data) => {
//                 setExpenses(data); // Guarda los datos en el estado
//                 setLoading(false);
//             })
//             .catch((error) => console.error("Error:", error));
//     }, [idGroup]);
//
//
//     if (loading) return <p>Cargando...</p>;
//
//     return (
//         <div>
//             <h1>Gastos del Grupo {idGroup}</h1>
//              {/*<ExpenseHeader group={group} />*/}
//             <ExpenseUnderHeader />
//
//             {/* Mostrar la lista de gastos */}
//             <ExpenseList expenses={expenses} />
//         </div>
//     );
// }


import React, { useState, useEffect } from 'react';
import ExpenseHeader from '../components/ExpenseHeader';
import ExpenseUnderHeader from '../components/ExpenseUnderHeader';
import ExpenseList from "../components/ExpenseList";
import AddMemberModal from "../components/AddMemberModal"; // Importamos el modal
import { useParams } from "react-router-dom";

export function Expense() {
    const { idGroup } = useParams(); // Obtenemos el id del grupo desde la URL
    const [expenses, setExpenses] = useState([]); // Estado para los gastos
    const [loading, setLoading] = useState(true); // Estado para indicar si los datos están cargando
    const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar la visibilidad del modal

    useEffect(() => {
        const url = `http://localhost:8080/users/1/groups/${idGroup}/expenses`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener los datos");
                }
                return response.json();
            })
            .then((data) => {
                setExpenses(data);
                setLoading(false);
            })
            .catch((error) => console.error("Error:", error));
    }, [idGroup]);

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Gastos del Grupo {idGroup}</h1>

            {/* Componente de encabezado */}
            {/* <ExpenseHeader group={group} /> */}

            {/* Botones bajo el encabezado */}
            <ExpenseUnderHeader
                onAddMember={() => setModalOpen(true)} // Abre el modal
                onShowDebts={() => console.log("Mostrar deudas")} // Agrega tu lógica para mostrar deudas
            />

            {/* Lista de gastos */}
            <ExpenseList expenses={expenses} />

            {/* Modal para añadir miembros */}
            {isModalOpen && (
                <AddMemberModal
                    idGroup={idGroup}
                    onClose={() => setModalOpen(false)} // Cierra el modal
                />
            )}
        </div>
    );
}
