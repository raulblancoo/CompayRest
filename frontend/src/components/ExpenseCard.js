import React, {useTransition} from 'react';
import axiosInstance from './axiosInstance';
import { getCurrencySymbol } from './CurrencyUtils'; // Importamos la función para obtener el símbolo
import {useTranslation} from "react-i18next";

function ExpenseCard({ expense, userId, groupId, isDropdownOpen, toggleDropdown, onDelete, onEdit }) {
    const { origin_user, amount, group, expense_name, id } = expense;
    const { t } = useTranslation();


    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/users/${userId}/groups/${groupId}/expenses/${id}`);
            onDelete(id); // Notificar al componente padre que se eliminó un gasto
        } catch (error) {
            console.error(t('error_deleting_expense', { id }), error);
        }
    };

    return (
        <div
            className="mt-8 h-100 shadow rounded-lg bg-gray-200 flex justify-between items-center px-5 py-3 hover:bg-gray-400 cursor-pointer transition duration-300 focus:bg-gray-500 mb-6"
        >
            <img
                className="hidden md:flex w-9 rounded-full"
                src={origin_user.avatarURL || 'https://via.placeholder.com/36'} // Avatar por defecto
                alt={origin_user.username}
            />
            <p className="text-gray-700 font-thin sm:me-6">
                <span className="font-bold uppercase">{origin_user.username}</span>{t('paid')}{' '}
                <span className="text-green-600 font-bold">
                    {amount}{getCurrencySymbol(group.currency)}
                </span>{' '}{t('for')}{' '}
                <span className="font-bold uppercase">{expense_name}</span>
            </p>

            <div className="relative">
                <button
                    id={`dropdownMenuIconButton-${id}`}
                    onClick={() => toggleDropdown(id)} // Alternar el estado del dropdown
                    className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
                    type="button"
                >
                    <svg
                        className="w-4 h-4 text-black"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 4 15"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                        />
                    </svg>
                </button>

                {isDropdownOpen && (
                    <div
                        id={`dropdownDots-${id}`}
                        className="absolute right-0 mt-2 w-40 bg-gray-200 divide-y divide-gray-100 rounded-lg shadow z-50"
                    >
                        <ul className="py-2 text-sm text-gray-700" aria-labelledby={`dropdownMenuIconButton-${id}`}>
                            <li>
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black"
                                    onClick={() => onEdit(expense)} // Llamar a la función de edición
                                >
                                    {t('edit')}
                                </button>
                            </li>
                            <li>
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black"
                                    onClick={handleDelete}
                                >
                                    {t('delete')}
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExpenseCard;
