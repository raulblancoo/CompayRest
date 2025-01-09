import React from "react";
import { getUserIdFromToken } from "./AuthUtils";
import { getCurrencySymbol } from "./CurrencyUtils";
import { useTranslation } from "react-i18next";

const BizumsModal = ({ isOpen, onClose, bizums, members, currency }) => {
    const { t } = useTranslation();

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
        const net = received - paid;
        return { ...member, received, paid, net };
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
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                {/* Tabla de balances */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-blue-600">{t('balances_by_user')}</h3>
                    {balances.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr>
                                <th className="border-b-2 py-2 uppercase">{t('user')}</th>
                                <th className="border-b-2 py-2 text-green-500 uppercase">{t('owes_you')}</th>
                                <th className="border-b-2 py-2 text-red-500 uppercase">{t('you_owe')}</th>
                                <th className="border-b-2 py-2 text-gray-900 uppercase">{t('net_balance')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {balances.map((balance) => (
                                <tr
                                    key={balance.id}
                                    className={
                                        balance.net < 0
                                            ? 'bg-red-100'
                                            : balance.net > 0
                                                ? 'bg-green-100'
                                                : 'bg-gray-100'
                                    }
                                >
                                    <td className="ml-1 py-2 flex items-center">
                                        <img
                                            src={balance.avatarURL}
                                            alt={balance.name}
                                            className="w-8 h-8 rounded-full mr-2"
                                        />
                                        {balance.name} {balance.surname}
                                    </td>
                                    <td className="py-2 text-gray-500 font-bold">
                                        {balance.received.toFixed(2)} {currencySymbol}
                                    </td>
                                    <td className="py-2 text-gray-500 font-bold">
                                        {balance.paid.toFixed(2)} {currencySymbol}
                                    </td>
                                    <td
                                        className={`py-2 font-bold ${
                                            balance.net > 0
                                                ? 'text-green-500'
                                                : balance.net < 0
                                                    ? 'text-red-500'
                                                    : 'text-gray-500'
                                        }`}
                                    >
                                        {balance.net.toFixed(2)} {currencySymbol}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 text-center">{t('no_expenses')}</p>
                    )}
                </div>

                {/* Mis Bizums */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-blue-600">{t('my_bizums')}</h3>
                    {userDebts.length > 0 ? (
                        <ul className="space-y-2">
                            {userDebts.map((bizum, index) => (
                                <li key={index} className="p-4 bg-gray-100 rounded-md">
                                    {bizum.loan_user.id === currentUserId
                                        ? <p><span
                                            className="font-semibold">{bizum.payer_user.name} {bizum.payer_user.surname}</span> {t('owes_you')} <span
                                            className="text-green-600">{bizum.amount.toFixed(2)} {currencySymbol}</span>
                                        </p>
                                        : <p>{t('you_owe')} <span
                                            className="text-red-600">{bizum.amount.toFixed(2)} {currencySymbol}</span> {t('to')} <span
                                            className="font-semibold">{bizum.loan_user.name} {bizum.loan_user.surname}</span>
                                        </p>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center">{t('no_pending_actions')}</p>
                    )}
                </div>

                {/* Otras Bizums */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-blue-600">{t('other_bizums')}</h3>
                    {otherDebts.length > 0 ? (
                        <ul className="space-y-2">
                            {otherDebts.map((bizum, index) => (
                                <li key={index} className="p-4 bg-gray-100 rounded-md">
                                    <p><span
                                        className="font-semibold">{bizum.payer_user.name} {bizum.payer_user.surname}</span> {t('owes')} <span
                                        className="text-red-600">{bizum.amount.toFixed(2)} {currencySymbol}</span> {t('to')} <span
                                        className="font-semibold">{bizum.loan_user.name} {bizum.loan_user.surname}</span>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center">{t('no_more_pending_actions')}</p>
                    )}
                </div>

                {/* Botón Cerrar */}
                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-cyan-700 rounded-lg"
                    >
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BizumsModal;
