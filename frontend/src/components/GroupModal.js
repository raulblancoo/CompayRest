import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const GroupModal = ({ isOpen, onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [groupName, setGroupName] = useState("");
    const [currency, setCurrency] = useState("EUR");
    const [emails, setEmails] = useState([]);
    const [emailInput, setEmailInput] = useState("");

    const handleAddEmail = () => {
        if (emailInput && !emails.includes(emailInput)) {
            setEmails([...emails, emailInput]);
            setEmailInput("");
        }
    };

    const handleRemoveEmail = (emailToRemove) => {
        setEmails(emails.filter((email) => email !== emailToRemove));
    };

    const handleSubmit = () => {
        const data = {
            group_name: groupName,
            currency,
            userEmails: emails,
        };

        onSubmit(data);
        handleClose();
    };

    const handleClose = () => {
        setGroupName("");
        setCurrency("EUR");
        setEmails([]);
        setEmailInput("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-xl font-semibold mb-4">{t("create_new_group")}</h2>
                <form>
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
