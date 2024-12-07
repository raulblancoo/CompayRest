import React from 'react';

function ExpenseCard({ expense }) {
    const { origin_user, amount, group, expense_name, users, id } = expense;

    return (
        <div
            className="mt-8 h-100 shadow rounded-lg bg-gray-200 flex justify-between items-center px-5 py-3 hover:bg-gray-400 cursor-pointer transition duration-300 focus:bg-gray-500 mb-6"
        >
            <img
                className="hidden md:flex w-9 rounded-full"
                src={origin_user.avatarURL}
                alt={origin_user.username}
            />
            <p className="text-gray-700 font-thin sm:me-6">
                <span className="font-bold uppercase">{origin_user.username}</span>
                <span>{/* Aquí puedes poner el texto que necesites */}</span>
                <span className="text-green-600 font-bold">
                    {amount} {group.currency === 'EURO' ? '€' : group.currency === 'DOLAR' ? '$' : group.currency}
                </span>
                <span>{/* Aquí también puedes poner texto adicional */}</span>
                <span className="font-bold uppercase">{expense_name}</span>
            </p>

            {/* Grupo de imágenes para pantallas grandes */}
            {/*<div className="hidden lg:flex items-center mr-1">*/}
            {/*    {users.slice(0, 2).map((user) => (*/}
            {/*        <img*/}
            {/*            key={user.id}*/}
            {/*            className="object-cover w-8 h-8 rounded-full ring ring-green-500 hover:ring-gray-700"*/}
            {/*            src={user.avatarURL}*/}
            {/*            alt={user.name}*/}
            {/*        />*/}
            {/*    ))}*/}
            {/*</div>*/}

            {/* Grupo de imagen con números para pantallas pequeñas y medianas */}
            {/*<div className="hidden items-center mr-1 md:flex lg:hidden sm:ml-4">*/}
            {/*    <img*/}
            {/*        className="object-cover w-8 h-8 -mx-1 rounded-full ring ring-green-500 hover:ring-gray-700"*/}
            {/*        src={users[0].avatarURL}*/}
            {/*        alt={users[0].name}*/}
            {/*    />*/}
            {/*    <a*/}
            {/*        href="#"*/}
            {/*        className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-slate-700 border-2 border-white rounded-full hover:bg-gray-600 -mx-2"*/}
            {/*    >*/}
            {/*        +{users.length - 1}*/}
            {/*    </a>*/}
            {/*</div>*/}

            {/* Botón tres puntos opciones con IDs únicos */}
            <button
                id={`dropdownMenuIconButton-${id}`}
                data-dropdown-toggle={`dropdownDots-${id}`}
                className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
                type="button"
            >
                <svg className="w-4 h-4 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                    />
                </svg>
            </button>

            {/* Menú desplegable */}
            {/*<div id={`dropdownDots-${id}`} className="hidden bg-gray-200 divide-y divide-gray-100 rounded-lg shadow w-40">*/}
            {/*    <ul className="py-2 text-sm text-gray-700" aria-labelledby={`dropdownMenuIconButton-${id}`}>*/}
            {/*        <li>*/}
            {/*            <a href="#" className="block px-4 py-2 hover:bg-gray-100 hover:text-black">*/}
            {/*                Editar*/}
            {/*            </a>*/}
            {/*        </li>*/}
            {/*        <li>*/}
            {/*            <a*/}
            {/*                href={`/group/expenses/delete/${expense.group.id}/${expense.id}`}*/}
            {/*                className="block px-4 py-2 hover:bg-gray-100 hover:text-black"*/}
            {/*            >*/}
            {/*                Eliminar*/}
            {/*            </a>*/}
            {/*        </li>*/}
            {/*    </ul>*/}
            {/*</div>*/}
        </div>
    );
}

export default ExpenseCard;
