import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";

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
            errors.email = "Email is required.";
        }
        if (!formValues.password.trim()) {
            errors.password = "Password is required.";
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
            errors.name = "First Name is required.";
        }
        if (!formValues.surname.trim()) {
            errors.surname = "Last Name is required.";
        }
        if (!formValues.username.trim()) {
            errors.username = "Username is required.";
        }
        if (!formValues.email.trim()) {
            errors.email = "Email is required.";
        } else if (!emailRegex.test(formValues.email)) {
            errors.email = "Invalid email format.";
        }
        if (!formValues.password.trim()) {
            errors.password = "Password is required.";
        } else if (!passwordRegex.test(formValues.password)) {
            errors.password =
                "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
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
                }
            }
        } catch (error) {
            setFormErrors({ general: "An error occurred. Please retry." });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-900 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-2 text-blue-900">
                    {isLoginActive ? "Welcome back!" : "Register"}
                </h1>
                <form onSubmit={handleSubmit}>
                    {!isLoginActive && (
                        <>
                            <div className="mb-4">
                                <label className="block text-blue-900 font-medium" htmlFor="name">
                                    First Name
                                </label>
                                <input
                                    className="w-full p-3 border border-blue-300 rounded mt-1"
                                    id="name"
                                    name="name"
                                    placeholder="First Name"
                                    value={formValues.name}
                                    onChange={handleChange}
                                />
                                {formErrors.name && <p className="text-red-500">{formErrors.name}</p>}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-blue-900 font-medium"
                                    htmlFor="surname"
                                >
                                    Last Name
                                </label>
                                <input
                                    className="w-full p-3 border border-blue-300 rounded mt-1"
                                    id="surname"
                                    name="surname"
                                    placeholder="Last Name"
                                    value={formValues.surname}
                                    onChange={handleChange}
                                />
                                {formErrors.surname && (
                                    <p className="text-red-500">{formErrors.surname}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-blue-900 font-medium"
                                    htmlFor="username"
                                >
                                    Username
                                </label>
                                <input
                                    className="w-full p-3 border border-blue-300 rounded mt-1"
                                    id="username"
                                    name="username"
                                    placeholder="Username"
                                    value={formValues.username}
                                    onChange={handleChange}
                                />
                                {formErrors.username && (
                                    <p className="text-red-500">{formErrors.username}</p>
                                )}
                            </div>
                        </>
                    )}
                    <div className="mb-4">
                        <label className="block text-blue-900 font-medium" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full p-3 border border-blue-300 rounded mt-1"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={formValues.email}
                            onChange={handleChange}
                        />
                        {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-blue-900 font-medium" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full p-3 border border-blue-300 rounded mt-1"
                            id="password"
                            name="password"
                            placeholder="Password"
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
                        {isLoginActive ? "Login" : "Register"}
                    </button>
                </form>
                {formErrors.general && <p className="text-red-500 text-center mt-4">{formErrors.general}</p>}
                <p className="text-center text-blue-700 mt-6">
                    {isLoginActive
                        ? "Not registered? "
                        : "Already have an account? "}
                    <button
                        className="text-blue-500 font-semibold"
                        onClick={() => setIsLoginActive(!isLoginActive)}
                    >
                        {isLoginActive ? "Register here" : "Login here"}
                    </button>
                </p>
            </div>
        </div>
    );
}
