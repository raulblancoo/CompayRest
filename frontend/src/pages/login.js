import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import { useTranslation } from "react-i18next";

export function Login() {
    const [isLoginActive, setIsLoginActive] = useState(true);
    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
        name: "",
        surname: "",
        username: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Función para alternar entre Login y Registro y limpiar errores
    const toggleForm = () => {
        setIsLoginActive(!isLoginActive);
        setFormErrors({}); // Limpia los errores al cambiar de formulario
    };

    // Manejar cambios en los campos
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: "" })); // Limpia el error al escribir
    };

    // Validar campos del login
    const validateLogin = () => {
        const errors = {};
        if (!formValues.email.trim()) {
            errors.email = t("email_required");
        }
        if (!formValues.password.trim()) {
            errors.password = t("password_required");
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0; // Retorna true si no hay errores
    };

    // Validar campos del registro
    const validateRegister = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

        if (!formValues.name.trim()) {
            errors.name = t("first_name_required");
        }
        if (!formValues.surname.trim()) {
            errors.surname = t("last_name_required");
        }
        if (!formValues.username.trim()) {
            errors.username = t("username_required");
        }
        if (!formValues.email.trim()) {
            errors.email = t("email_required");
        } else if (!emailRegex.test(formValues.email)) {
            errors.email = t("invalid_email");
        }
        if (!formValues.password.trim()) {
            errors.password = t("password_required");
        } else if (!passwordRegex.test(formValues.password)) {
            errors.password = t("password_requirements");
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0; // Retorna true si no hay errores
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = isLoginActive ? validateLogin() : validateRegister();

        if (!isValid) return; // Si no es válido, no enviar

        try {
            if (isLoginActive) {
                const { email, password } = formValues;
                const response = await axiosInstance.post("/login", { email, password });
                if (response.status === 200 || response.status === 201) {
                    localStorage.setItem("token", response.data.token);
                    navigate("/groups");
                }
            } else {
                const response = await axiosInstance.post("/register", formValues);
                if (response.status === 200 || response.status === 201) {
                    setIsLoginActive(true); // Cambiar a login tras registro exitoso
                    setFormErrors({}); // Opcional: limpiar errores después del registro exitoso
                }
            }
        } catch (error) {
            setFormErrors({ general: t("general_error") });
          
          //develop rbg
           /* if (error.response && error.response.data) {
                const { message } = error.response.data;

                // Asignar errores específicos basados en el mensaje
                if (message.toLowerCase().includes("email")) {
                    setFormErrors({ email: message });
                } else {
                    setFormErrors({ general: message });
                }
            } else {
                setFormErrors({ general: "Ocurrió un error. Por favor, inténtalo de nuevo." });
            }*/
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-900 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-2 text-blue-900">
                    {isLoginActive ? t("welcome_back") : t("register")}
                </h1>
                <form onSubmit={handleSubmit}>
                    {!isLoginActive && (
                        <>
                            <div className="mb-4">
                                <label className="block text-blue-900 font-medium" htmlFor="name">
                                    {t("first_name")}
                                </label>
                                <input
                                    className="w-full p-3 border border-blue-300 rounded mt-1"
                                    id="name"
                                    name="name"
                                    placeholder={t("first_name")}
                                    value={formValues.name}
                                    onChange={handleChange}
                                />
                                {formErrors.name && <p className="text-red-500">{formErrors.name}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-blue-900 font-medium" htmlFor="surname">
                                    {t("last_name")}
                                </label>
                                <input
                                    className="w-full p-3 border border-blue-300 rounded mt-1"
                                    id="surname"
                                    name="surname"
                                    placeholder={t("last_name")}
                                    value={formValues.surname}
                                    onChange={handleChange}
                                />
                                {formErrors.surname && <p className="text-red-500">{formErrors.surname}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-blue-900 font-medium" htmlFor="username">
                                    {t("username")}
                                </label>
                                <input
                                    className="w-full p-3 border border-blue-300 rounded mt-1"
                                    id="username"
                                    name="username"
                                    placeholder={t("username")}
                                    value={formValues.username}
                                    onChange={handleChange}
                                />
                                {formErrors.username && <p className="text-red-500">{formErrors.username}</p>}
                            </div>
                        </>
                    )}
                    <div className="mb-4">
                        <label className="block text-blue-900 font-medium" htmlFor="email">
                            {t("email")}
                        </label>
                        <input
                            className="w-full p-3 border border-blue-300 rounded mt-1"
                            id="email"
                            name="email"
                            placeholder={t("email")}
                            value={formValues.email}
                            onChange={handleChange}
                        />
                        {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-blue-900 font-medium" htmlFor="password">
                            {t("password")}
                        </label>
                        <input
                            className="w-full p-3 border border-blue-300 rounded mt-1"
                            id="password"
                            name="password"
                            placeholder={t("password")}
                            type="password"
                            value={formValues.password}
                            onChange={handleChange}
                        />
                        {formErrors.password && (
                            <p className="text-red-500">{formErrors.password}</p>
                        )}
                    </div>
                    <button
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold text-lg"
                        type="submit"
                    >
                        {isLoginActive ? t("submit") : t("submit")} {/* Considera cambiar a t("login") : t("register") */}
                    </button>
                </form>
                {formErrors.general && (
                    <p className="text-red-500 text-center mt-4">{formErrors.general}</p>
                )}
                <p className="text-center text-blue-700 mt-6">
                    {isLoginActive
                        ? t("not_registered") + " "
                        : t("already_account") + " "}
                    <button
                        className="text-blue-500 font-semibold"
                        onClick={toggleForm} // Usar la función de alternancia
                    >
                        {isLoginActive ? t("register_here") : t("login_here")}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;
