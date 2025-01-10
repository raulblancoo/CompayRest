import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import { getUserIdFromToken } from "./AuthUtils";
import { useTranslation } from "react-i18next";

const Navbar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const [user, setUser] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("es");
    const userDropdownRef = useRef(null);
    const languageDropdownRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    };

    const getUser = async () => {
        try {
            const response = await axiosInstance.get(`/users/me`);
            if (response.status === 204) {
                setUser({});
            } else {
                setUser(response.data);
            }
        } catch (error) {
            console.error(t("errorFetchingUser"), error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    // Cierra los dropdowns si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
                setIsLanguageDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleUserDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
        setIsLanguageDropdownOpen(false);
    };

    const toggleLanguageDropdown = () => {
        setIsLanguageDropdownOpen((prevState) => !prevState);
        setIsDropdownOpen(false);
    };

    const handleLanguageChange = (language) => {
        i18n.changeLanguage(language);
        localStorage.setItem("language", language);
        setSelectedLanguage(language);
        setIsLanguageDropdownOpen(false);
    };

    const languages = [
        { code: "es", label: t("spanish"), flag: "https://cdn.icon-icons.com/icons2/1531/PNG/512/3253482-flag-spain-icon_106784.png" },
        { code: "en", label: t("english"), flag: "https://cdn.icon-icons.com/icons2/107/PNG/512/united_kingdom_flag_flags_18060.png" },
    ];

    const currentLanguage = languages.find((lang) => lang.code === selectedLanguage);

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
                                <span className="text-sky-500 px-3 py-2">{t("groups")}</span>
                            </Link>
                            <Link to="/myExpenses">
                                <span className="text-slate-700 px-3 py-2 hover:text-sky-500 transition-colors">{t("expenses")}</span>
                            </Link>
                            <Link to="/myDebts">
                                <span className="text-slate-700 px-3 py-2 hover:text-sky-500 transition-colors">{t("debts")}</span>
                            </Link>
                        </div>
                    </div>
                    <div className="relative flex items-center space-x-4">
                        <div className="relative" ref={languageDropdownRef}>
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={toggleLanguageDropdown}
                            >
                                <img
                                    className="w-8 h-8 rounded"
                                    src={currentLanguage.flag}
                                    alt={currentLanguage.label}
                                />
                            </div>
                            {isLanguageDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-40 bg-white border rounded shadow-lg z-50 left-1/2 transform -translate-x-1/2">
                                    <ul>
                                        {languages.map((language) => (
                                            <li
                                                key={language.code}
                                                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleLanguageChange(language.code)}
                                            >
                                                <img
                                                    src={language.flag}
                                                    alt={language.label}
                                                    className="w-5 h-5 rounded mr-2"
                                                />
                                                <span>{language.label}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Avatar y Menú del Usuario */}
                        <div className="relative" ref={userDropdownRef}>
                            <img
                                className="w-9 h-9 rounded-full cursor-pointer"
                                src={user.avatarURL || "https://via.placeholder.com/36"}
                                alt={user.username || t("unknownUser")}
                                onClick={toggleUserDropdown}
                            />
                            {isDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 left-1/2 transform -translate-x-1/2 w-48 bg-white border rounded shadow-md z-50">
                                    <div className="p-4">
                                        <p className="font-bold">{user.name || t("unknownName")}</p>
                                        <p className="text-sm text-gray-600">{user.email || t("unknownEmail")}</p>
                                    </div>
                                    <div className="border-t">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                                        >
                                            {t("logout")}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
