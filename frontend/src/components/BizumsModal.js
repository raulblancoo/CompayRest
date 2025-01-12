import React, { useState, useEffect } from "react";
import axiosInstance from "../components/axiosInstance";
import { getCurrencySymbol } from "./CurrencyUtils";
import { useTranslation } from "react-i18next";

const BizumsModal = ({ isOpen, onClose, bizums, members, currency }) => {
    const [currentUserId, setCurrentUserId] = useState(null); // Almacenar el userId del backend
    const { t } = useTranslation();

    // Obtener el userId desde el backend
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axiosInstance.get("/users/me"); // Endpoint que devuelve el usuario autenticado
                setCurrentUserId(response.data.id); // Almacenar el userId en el estado
            } catch (error) {
                console.error("Error al obtener el userId:", error);
            }
        };

        fetchUserId();
    }, []);

    if (!isOpen) return null;

    // Mostrar un estado de carga si el `userId` aún no está cargado
    if (!currentUserId) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <p className="text-white text-lg sm:text-xl">Cargando datos...</p>
            </div>
        );
    }

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                {/* Tabla de balances */}
                <div className="mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-blue-600">{t("balances_by_user")}</h3>
                    {balances.length > 0 ? (
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                            <tr>
                                <th className="border-b-2 py-2 uppercase px-2">{t("user")}</th>
                                <th className="border-b-2 py-2 text-green-500 uppercase px-2">{t("is_owed")}</th>
                                <th className="border-b-2 py-2 text-red-500 uppercase px-2">{t("owes")}</th>
                                <th className="border-b-2 py-2 text-gray-900 uppercase px-2">{t("net_balance")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {balances.map((balance) => (
                                <tr
                                    key={balance.id}
                                    className={
                                        balance.net < 0
                                            ? "bg-red-100"
                                            : balance.net > 0
                                                ? "bg-green-100"
                                                : "bg-gray-100"
                                    }
                                >
                                    <td className="py-2 px-2 flex items-center">
                                        {/* Ocultar la imagen en pantallas pequeñas */}
                                        <img
                                            src={balance.avatarURL}
                                            alt={balance.name}
                                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2 hidden sm:block"
                                        />
                                        {/* Mostrar solo el nombre en pantallas pequeñas */}
                                        <span className="text-xs sm:text-sm">
                                                {balance.name}{" "}
                                            <span className="hidden sm:inline">{balance.surname}</span>
                                            </span>
                                    </td>
                                    <td className="py-2 px-2 text-gray-500 sm:font-bold">
                                        {balance.received.toFixed(2)} {currencySymbol}
                                    </td>
                                    <td className="py-2 px-2 text-gray-500 sm:font-bold">
                                        {balance.paid.toFixed(2)} {currencySymbol}
                                    </td>
                                    <td
                                        className={`py-2 px-2 font-bold ${
                                            balance.net > 0
                                                ? "text-green-500"
                                                : balance.net < 0
                                                    ? "text-red-500"
                                                    : "text-gray-500"
                                        }`}
                                    >
                                        {balance.net.toFixed(2)} {currencySymbol}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 text-center text-xs sm:text-sm">{t("noExpenses")}.</p>
                    )}
                </div>

                {/* Mis Bizums */}
                <div className="mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-blue-600">{t("my_bizums")}</h3>
                    {userDebts.length > 0 ? (
                        <ul className="space-y-2 text-xs sm:text-sm">
                            {userDebts.map((bizum, index) => (
                                <li key={index} className="p-3 sm:p-4 bg-gray-100 rounded-md">
                                    {bizum.loan_user.id === currentUserId ? (
                                        <p>
                                            <span className="font-semibold">
                                                {bizum.payer_user.name}{" "}
                                                <span className="hidden sm:inline">{bizum.payer_user.surname}</span>
                                            </span>{" "}
                                            {t("owes")}{" "}
                                            <span className="text-green-600">
                                                {bizum.amount.toFixed(2)} {currencySymbol}
                                            </span>
                                        </p>
                                    ) : (
                                        <p>
                                            {t("you_owe")}{" "}
                                            <span className="text-red-600">
                                                {bizum.amount.toFixed(2)} {currencySymbol}
                                            </span>{" "}
                                            {t("to")}{" "}
                                            <span className="font-semibold">
                                                {bizum.loan_user.name}{" "}
                                                <span className="hidden sm:inline">{bizum.loan_user.surname}</span>
                                            </span>
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center text-xs sm:text-sm">{t("no_more_pending_actions")}</p>
                    )}
                </div>

                {/* Otras Bizums */}
                <div className="mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-blue-600">{t("other_bizums")}</h3>
                    {otherDebts.length > 0 ? (
                        <ul className="space-y-2 text-xs sm:text-sm">
                            {otherDebts.map((bizum, index) => (
                                <li key={index} className="p-3 sm:p-4 bg-gray-100 rounded-md">
                                    <p>
                                        <span className="font-semibold">
                                            {bizum.payer_user.name}{" "}
                                            <span className="hidden sm:inline">{bizum.payer_user.surname}</span>
                                        </span>{" "}
                                        {t("owes")}{" "}
                                        <span className="text-red-600">
                                            {bizum.amount.toFixed(2)} {currencySymbol}
                                        </span>{" "}
                                        {t("to")}{" "}
                                        <span className="font-semibold">
                                            {bizum.loan_user.name}{" "}
                                            <span className="hidden sm:inline">{bizum.loan_user.surname}</span>
                                        </span>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center text-xs sm:text-sm">{t("no_more_pending_actions")}</p>
                    )}
                </div>

                {/* Botón Cerrar */}
                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white bg-sky-500 hover:bg-cyan-700 rounded-lg"
                    >
                        {t("close")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BizumsModal;
