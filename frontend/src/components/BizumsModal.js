import React from "react";
import { getUserIdFromToken } from "./AuthUtils";
import { getCurrencySymbol } from "./CurrencyUtils";

const BizumsModal = ({ isOpen, onClose, bizums, members, currency }) => {
    if (!isOpen) return null;

    const currentUserId = getUserIdFromToken();

    // Obtener el símbolo de la moneda
    const currencySymbol = getCurrencySymbol(currency);

    // Crear balances por usuario
    const balances = members.map((member) => {
        const received = bizums
            .filter((bizum) => bizum.loan_user.id === member.id)
            .reduce((sum, bizum) => sum + bizum.amount, 0);
        const paid = bizums
            .filter((bizum) => bizum.payer_user.id === member.id)
            .reduce((sum, bizum) => sum + bizum.amount, 0);
        return { ...member, received, paid };
    });

    // Filtrar bizums relacionados con el usuario logueado
    const userDebts = bizums.filter(
        (bizum) =>
            bizum.loan_user.id === currentUserId || bizum.payer_user.id === currentUserId
    );

    // Filtrar bizums que no involucran al usuario logueado
    const otherDebts = bizums.filter(
        (bizum) =>
            bizum.loan_user.id !== currentUserId && bizum.payer_user.id !== currentUserId
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 uppercase">Deudas del Grupo</h2>

                {/* Primera sección: Tabla de balances */}
                <div className="mb-6">
                    {balances.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr>
                                <th className="border-b-2 py-2 uppercase">Usuario</th>
                                <th className="border-b-2 py-2 text-green-500 uppercase">Le deben</th>
                                <th className="border-b-2 py-2 text-red-500 uppercase">Debe</th>
                            </tr>
                            </thead>
                            <tbody>
                            {balances.map((balance) => (
                                <tr key={balance.id}>
                                    <td className="py-2 flex items-center">
                                        <img
                                            src={balance.avatarURL || "/default-profile.png"}
                                            alt={balance.name}
                                            className="w-8 h-8 rounded-full mr-2"
                                        />
                                        {balance.name} {balance.surname}
                                    </td>
                                    <td className="py-2 text-green-500 font-bold">
                                        {balance.received.toFixed(2)} {currencySymbol}
                                    </td>
                                    <td className="py-2 text-red-500 font-bold">
                                        {balance.paid.toFixed(2)} {currencySymbol}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 text-center">Todavía no hay gastos para este grupo.</p>
                    )}
                </div>

                {/* Segunda sección: Mis Bizums */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Mis Bizums</h3>
                    {userDebts.length > 0 ? (
                        userDebts.map((bizum, index) => (
                            <p key={index} className="text-gray-700">
                                {bizum.loan_user.id === currentUserId
                                    ? `${bizum.payer_user.name} ${bizum.payer_user.surname} te debe ${bizum.amount.toFixed(2)} ${currencySymbol}.`
                                    : `Debes ${bizum.amount.toFixed(2)} ${currencySymbol} a ${bizum.loan_user.name} ${bizum.loan_user.surname}.`}
                            </p>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No tienes acciones pendientes.</p>
                    )}
                </div>

                {/* Tercera sección: Otras Bizums */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Otros Bizums</h3>
                    {otherDebts.length > 0 ? (
                        otherDebts.map((bizum, index) => (
                            <p key={index} className="text-gray-700">
                                {bizum.payer_user.name} {bizum.payer_user.surname} le debe {bizum.amount.toFixed(2)} {currencySymbol} a {bizum.loan_user.name} {bizum.loan_user.surname}.
                            </p>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No hay más acciones pendientes.</p>
                    )}
                </div>

                {/* Botón Cerrar */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-sky-500 hover:bg-cyan-700 text-white px-4 py-2 rounded-md"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BizumsModal;
