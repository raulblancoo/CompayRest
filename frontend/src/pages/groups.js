import { useEffect, useState } from "react";
import GroupList from "../components/GroupList";
import axiosInstance from "../components/axiosInstance";
import GroupModal from "../components/GroupModal";
import { getUserIdFromToken } from "../components/AuthUtils";
import { useTranslation } from "react-i18next";

export function Groups() {
    const { t } = useTranslation();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const userId = getUserIdFromToken();

    useEffect(() => {
        const fetchGroups = async () => {
            if (!userId) {
                setError(t("no_user_error"));
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get(`/users/${userId}/groups`);
                setGroups(response.data);
                setLoading(false);
            } catch (err) {
                console.error(t("error_fetching_groups"), err);
                setError(t("error_fetching_groups"));
                setLoading(false);
            }
        };

        fetchGroups();
    }, [userId]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleCreateGroup = async (newGroup) => {
        try {
            const response = await axiosInstance.post(`/users/${userId}/groups`, newGroup);
            setGroups((prevGroups) => [...prevGroups, response.data]);
            setIsModalOpen(false);
        } catch (err) {
            console.error(t("error_creating_group"), err);
        }
    };

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow overflow-y-auto pb-24">
                    {loading && <p className="text-center">{t("loading")}</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!loading && !error && (
                        <>
                            <GroupList
                                groups={groups}
                                noGroupsMessage={t("no_groups_message")}
                            />
                            <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2">
                                <button
                                    onClick={handleOpenModal}
                                    className="p-2 flex justify-center items-center rounded-full bg-sky-500 text-white px-6 py-3 mx-5 -mb-4 hover:bg-cyan-700 focus:outline-none focus:bg-blue-500"
                                >
                                    {t("create_new_group")}
                                </button>
                            </div>
                        </>
                    )}
                </main>
            </div>
            <GroupModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleCreateGroup}
            />
        </>
    );
}
