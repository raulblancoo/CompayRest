import React, { useState, useEffect } from 'react';
import axiosInstance from "../components/axiosInstance";
import { getUserIdFromToken } from "./AuthUtils";
import { useTranslation } from "react-i18next";

const AddMemberModal = ({ onClose, idGroup, groupMembers, onMembersAdded }) => {
    const { t } = useTranslation();
    const [emails, setEmails] = useState([]);
    const [currentEmail, setCurrentEmail] = useState('');
    const [members, setMembers] = useState(groupMembers || []);

    const userId = getUserIdFromToken();

    useEffect(() => {
        // Fetch members if not passed as prop
        if (!groupMembers) {
            const fetchMembers = async () => {
                try {
                    const response = await axiosInstance.get(`/users/${userId}/groups/${idGroup}/members`);
                    setMembers(response.data);
                } catch (error) {
                    console.error(t('error_loading_members'), error);
                }
            };
            fetchMembers();
        }
    }, [groupMembers, idGroup, userId, t]);

    const handleAddEmail = () => {
        if (currentEmail && !emails.includes(currentEmail)) {
            setEmails([...emails, currentEmail]);
            setCurrentEmail('');
        }
    };

    const handleRemoveEmail = (email) => {
        setEmails(emails.filter((e) => e !== email));
    };

    const handleSubmit = async () => {
        try {
            await axiosInstance.post(`/users/${userId}/groups/${idGroup}/members/email`, emails);
            onMembersAdded(); // Notificar al padre que se han añadido miembros
            onClose(); // Cerrar el modal
        } catch (error) {
            console.error(t('error_adding_members'), error);
            alert(t('error_adding_members_alert'));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">{t('add_members')}</h2>

                {/* Lista de usuarios actuales del grupo */}
                <div className="mb-4">
                    <h3 className="font-semibold text-gray-600 mb-2">
                        {t('current_members', { count: members.length })}
                    </h3>
                    <ul className="space-y-4">
                        {members.map((member) => (
                            <li key={member.email} className="flex items-center gap-4">
                                <img
                                    src={member.avatarURL || "https://via.placeholder.com/40"}
                                    alt={member.name}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="font-medium text-gray-800">{member.name} {member.surname}</p>
                                    <p className="text-sm text-gray-500">{member.email}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Campo de Emails */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">{t('emails')}</label>
                    <div className="flex gap-2 items-stretch">
                        <input
                            type="email"
                            placeholder={t('add_email_placeholder')}
                            value={currentEmail}
                            onChange={(e) => setCurrentEmail(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddEmail();
                                }
                            }}
                            className="flex-grow p-2 border rounded-l-md"
                        />
                        <button
                            onClick={handleAddEmail}
                            className="px-4 bg-sky-500 hover:bg-cyan-700 text-white rounded-r-md"
                        >
                            {t('add')}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {emails.map((email) => (
                            <span
                                key={email}
                                className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
                            >
                                {email}
                                <button
                                    onClick={() => handleRemoveEmail(email)}
                                    className="text-red-500"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-100 rounded-lg mr-2"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-cyan-700 rounded-lg"
                    >
                        {t('add')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
