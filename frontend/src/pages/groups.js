import { useEffect, useState } from "react";
import GroupList from "../components/GroupList";
import axios from "axios";
import GroupModal from "../components/GroupModal";

export function Groups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                // TODO: Cambiar "1" por el ID del usuario actual
                const response = await axios.get("http://localhost:8080/users/1/groups");
                setGroups(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching groups:", err);
                setError("Failed to fetch groups");
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleCreateGroup = async (newGroup) => {
        try {
            const response = await axios.post("http://localhost:8080/users/1/groups", newGroup);
            setGroups((prevGroups) => [...prevGroups, response.data]);
            setIsModalOpen(false); // Cierra la modal después de crear el grupo
        } catch (err) {
            console.error("Error creating group:", err);
            alert("Error creating group");
        }
    };

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow overflow-y-auto pb-24">
                    {loading && <p className="text-center">Loading...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!loading && !error && (
                        <>
                            <GroupList
                                groups={groups}
                                noGroupsMessage="No groups available"
                            />
                            {/* Botón para abrir la modal */}
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={handleOpenModal}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                                >
                                    Crear Nuevo Grupo
                                </button>
                            </div>
                        </>
                    )}
                </main>
            </div>

            {/* Modal */}
            <GroupModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleCreateGroup}
            />
        </>
    );
}
