import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const BizumsModal = ({ isOpen, onClose, bizums }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current && isOpen && bizums.length > 0) {
            const ctx = chartRef.current.getContext("2d");

            // Destruir gráfico previo para evitar duplicados
            if (Chart.instances.length > 0) {
                Chart.instances.forEach((chartInstance) => chartInstance.destroy());
            }

            // Calcular cuánto debe cada usuario
            const debtByUser = bizums.reduce((acc, bizum) => {
                const payerName = `${bizum.payer_user.name} ${bizum.payer_user.surname}`;
                acc[payerName] = (acc[payerName] || 0) + bizum.amount;
                return acc;
            }, {});

            // Preparar datos para el gráfico
            const labels = Object.keys(debtByUser);
            const data = Object.values(debtByUser);

            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Cantidad total a pagar",
                            data: data,
                            backgroundColor: "#0ea4e7",
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: "y", // Cambia a barras horizontales
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                },
            });
        }
    }, [bizums, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Bizums del Grupo</h2>

                {/* Contenido de scrollable */}
                <div>
                    {/* Lista de Bizums */}
                    <div className="mb-4">
                        {bizums && bizums.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr>
                                    <th className="border-b-2 py-2 uppercase text-green-500">Recibe</th>
                                    <th className="border-b-2 py-2 uppercase text-red-500">Paga</th>
                                    <th className="border-b-2 py-2 text-right uppercase">Cantidad</th>
                                </tr>
                                </thead>
                                <tbody>
                                {bizums.map((bizum, index) => (
                                    <tr key={index}>
                                        <td className="py-2">
                                            {bizum.loan_user.name} {bizum.loan_user.surname}
                                        </td>
                                        <td className="py-2">
                                            {bizum.payer_user.name} {bizum.payer_user.surname}
                                        </td>
                                        <td className="py-2 text-right font-bold">{bizum.amount} €</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500 text-center">
                                No hay bizums para este grupo.
                            </p>
                        )}
                    </div>

                    {/* Gráfico de Barras Horizontales */}
                    <div className="mb-4" style={{ height: "300px" }}>
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>

                {/* Botón Cerrar */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BizumsModal;
