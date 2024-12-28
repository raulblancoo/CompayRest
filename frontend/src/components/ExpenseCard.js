import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from './axiosInstance';

function ExpenseCard({ expense, userId, groupId, onDelete }) {
    const { origin_user, amount, group, expense_name, id } = expense;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/users/${userId}/groups/${groupId}/expenses/${id}`);
            console.log(`Gasto ${id} eliminado con éxito`);
            onDelete(id); // Notificar al componente padre que se eliminó un gasto
        } catch (error) {
            console.error(`Error al eliminar el gasto ${id}:`, error);
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
                <span className="font-bold uppercase">{origin_user.username}</span>{' '}
                <span className="text-green-600 font-bold">
                    {amount}{' '}
                    {group.currency === 'EURO'
                        ? '€'
                        : group.currency === 'DOLAR'
                            ? '$'
                            : group.currency}
                </span>{' '}
                <span className="font-bold uppercase">{expense_name}</span>
            </p>

            {/* Botón tres puntos opciones con IDs únicos */}
            <div className="relative" ref={dropdownRef}>
                <button
                    id={`dropdownMenuIconButton-${id}`}
                    onClick={toggleDropdown}
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

                {/* Menú desplegable */}
                {isDropdownOpen && (
                    <div
                        id={`dropdownDots-${id}`}
                        className="absolute right-0 mt-2 w-40 bg-gray-200 divide-y divide-gray-100 rounded-lg shadow"
                    >
                        <ul className="py-2 text-sm text-gray-700" aria-labelledby={`dropdownMenuIconButton-${id}`}>
                            <li>
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black"
                                    onClick={() => console.log(`Editar gasto ${id}`)}
                                >
                                    Editar
                                </button>
                            </li>
                            <li>
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-black"
                                    onClick={handleDelete}
                                >
                                    Eliminar
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
