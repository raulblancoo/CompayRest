import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import { getUserIdFromToken } from "./AuthUtils";

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para controlar el menú desplegable

    const handleLogout = () => {
        // Eliminar el token y redirigir al login
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    };

    const getUser = async () => {
        try {
            const userId = getUserIdFromToken();
            const response = await axiosInstance.get(`/users/${userId}`);
            if (response.status === 204) {
                setUser({});
            } else {
                setUser(response.data);
            }
        } catch (error) {
            console.error("Error al obtener el usuario loggeado:", error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    return (
        <nav className="bg-white shadow">
            <div className="shadow px-5">
                <div className="flex justify-between items-center h-16 max-w-6xl mx-auto">
                    <div className="block sm:invisible">
                        <button
                            data-collapse-toggle="navbar-collapse"
                            type="button"
                            className="text-slate-500 hover:bg-sky-500 hover:text-slate-100 transition-colors rounded p-1 -ml-1 focus:ring-2"
                            aria-controls="navbar-collapse"
                            aria-expanded="false"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center">
                        <Link to="">
                            <div className="text-sky-500 hover:rotate-6 duration-200">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-8"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                            </div>
                        </Link>
                        <div className="space-x-6 ml-6 hidden sm:flex">
                            <Link to="/groups">
                                <span className="text-sky-500 px-3 py-2">Grupos</span>
                            </Link>
                            <Link to="/myExpenses">
                                <span className="text-slate-700 px-3 py-2 hover:text-sky-500 transition-colors">Gastos</span>
                            </Link>
                            <Link to="/myDebts">
                                <span className="text-slate-700 px-3 py-2 hover:text-sky-500 transition-colors">Deudas</span>
                            </Link>
                        </div>
                    </div>

                    <div className="relative flex items-center space-x-4">
                        <div className="flex items-center">
                            {/* Bandera de España */}
                            <img
                                className="w-6 h-6 cursor-pointer"
                                src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" // URL de la bandera de España
                                alt="Bandera de España"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <img
                                className="w-9 h-9 rounded-full cursor-pointer"
                                src={user.avatarURL || "https://via.placeholder.com/36"} // Usa un avatar por defecto si no hay avatarURL
                                alt={user.username || "Usuario"}
                                onClick={toggleDropdown} // Al hacer clic, alterna el estado del menú desplegable
                            />
                        </div>

                        {/* Menú Desplegable */}
                        {isDropdownOpen && (
                            <div className="absolute left-1/2 transform -translate-x-1/2 top-full right-0 mt-2 w-48 bg-white border rounded shadow-md">
                                <div className="p-4">
                                    <p className="font-bold">{user.name || "Nombre Desconocido"}</p>
                                    <p className="text-sm text-gray-600">{user.email || "Email Desconocido"}</p>
                                </div>
                                <div className="border-t">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
