import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";


import axiosInstance from "./axiosInstance"; // Importa las validaciones

const GroupModal = ({ isOpen, onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [groupName, setGroupName] = useState("");
    const [currency, setCurrency] = useState("EUR");
    const [emails, setEmails] = useState([]);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [emailInput, setEmailInput] = useState("");
    const [errors, setErrors] = useState([]);
    const [user, setUser] = useState({});

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

    const handleAddEmail = () => {

        const existingEmails = emails;

        // Validar todos los campos del formulario
        let validationErrors = [];


        // Validar el nuevo email
        if (!emailInput.trim()) {
            validationErrors.push(t("email_required"));
        } else if (!emailRegex.test(emailInput)) {
            validationErrors.push(t("email_invalid_format"));
        } else if (existingEmails.includes(emailInput)) {
            validationErrors.push(t("email_already_added"));
        } else if (emailInput === user.email) {
            validationErrors.push(t("email_cannot_add_self"));
        }
        // Si hay errores, mostrarlos y detener el flujo
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Añadir el nuevo email si no hay errores
        setEmails([...emails, emailInput]);
        setEmailInput("");
        setErrors([]); // Limpiar errores si todo está correcto
    };

    const handleRemoveEmail = (emailToRemove) => {
        setEmails(emails.filter((email) => email !== emailToRemove));
    };

    const handleSubmit = () => {
        const existingEmails = emails;

        const userGroups = ["Grupo1", "Grupo2"]; // Reemplaza con los grupos del usuario
        const allowedCurrencies = ["EUR", "USD", "GBP"];
        const validationErrors = [];
        const regexGroupName = /^[\x20\x21-\xA8\xAD\xE0-\xED]*$/;


        // Validar nombre del grupo
        if (!groupName.trim()) validationErrors.push(t("group_name_required"));
        if (groupName.length > 20) validationErrors.push(t("group_name_max_length"));
        if (userGroups.includes(groupName)) validationErrors.push(t("group_name_exists"));
        if (!regexGroupName.test(groupName)) validationErrors.push(t("group_name_invalid_characters"));

        // Validar lista de emails

        if(existingEmails.length < 1){
            validationErrors.push(t("email_required"));
        }
        else if (existingEmails.includes(emailInput)) {
            validationErrors.push(t("email_already_added"));
        } else if (emailInput === user.email) {
            validationErrors.push(t("email_cannot_add_self"));
        }


        // Validar moneda
        if (!allowedCurrencies.includes(currency)) {
            errors.push(t("currency_not_allowed"));
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Si no hay errores, enviar los datos
        const data = {
            group_name: groupName,
            currency,
            userEmails: emails,
        };

        console.log("Data enviada:", data);
        onSubmit(data);
        handleClose();
    };

    const handleClose = () => {
        setGroupName("");
        setCurrency("EUR");
        setEmails([]);
        setEmailInput("");
        setErrors([]);
        onClose();
    };

    useEffect(() => {
        if (!isOpen) {
            // Limpiar los campos y errores cuando el modal se cierra
            setGroupName("");
            setCurrency("EUR");
            setEmails([]);
            setEmailInput("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">

                <h2 className="text-xl font-semibold mb-4">{t("create_new_group")}</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-4">
                        <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
                            {t("group_name")}
                        </label>
                        <input
                            type="text"
                            id="groupName"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        />
                    </div>

                    {/* Select: Moneda */}
                    <div className="mb-4">
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                            {t("currency")}
                        </label>
                        <select
                            id="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        >
                            <option value="EUR">{t("euro")}</option>
                            <option value="USD">{t("dollar")}</option>
                            <option value="GBP">{t("pound")}</option>
                            <option value="JPY">{t("yen")}</option>
                        </select>
                    </div>

                    {/* Input: Emails */}
                    <div className="mb-4">
                        <label htmlFor="emails" className="block text-sm font-medium text-gray-700">
                            {t("emails")}
                        </label>
                        <div className="flex">
                            <input
                                type="email"
                                id="emails"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder={t("add_email_placeholder")}
                                className="w-full border border-gray-300 rounded-md p-2 mt-1 mr-2"
                            />
                            <button
                                type="button"
                                onClick={handleAddEmail}
                                className="bg-blue-600 text-white px-3 py-2 rounded-md"
                            >
                                {t("add")}
                            </button>
                        </div>
                        <div className="mt-2">
                            {emails.map((email, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center bg-gray-100 rounded-md p-2 mt-1"
                                >
                                    <span>{email}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveEmail(email)}
                                        className="text-red-500"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>

                {errors.length > 0 && (
                    <div
                        id="divErrores"
                        className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50  dark:text-red-400"
                        role="alert"
                    >
                        <div>
                            <p className="font-medium">Errores:</p>
                            <ul className="mt-1.5 list-disc list-inside pl-5">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}




                {/* Botones */}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={handleClose}
                        className="bg-gray-300 px-4 py-2 rounded-md"
                    >
                        {t("close")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                        {t("submit")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupModal;
