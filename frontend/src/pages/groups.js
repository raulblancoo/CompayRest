import { useEffect, useState } from "react";
import GroupList from "../components/GroupList";
import axiosInstance from "../components/axiosInstance";
import GroupModal from "../components/GroupModal";
import { getUserIdFromToken } from "../components/AuthUtils";

export function Groups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createGroupError, setCreateGroupError] = useState(null); // Estado para errores al crear grupos

    const userId = getUserIdFromToken();
    //const navigate = useNavigate();

    useEffect(() => {
        const fetchGroups = async () => {

            if (!userId) {
                setError("¡No hay usuario logueado, por favor inicia sesión!");
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get(`/users/${userId}/groups`);
                setGroups(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching groups:", err);
                setError("Error al obtener los grupos");
                setLoading(false);
            }
        };

        fetchGroups();
    }, [userId]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCreateGroupError(null); // Limpiar errores al cerrar el modal
    };

    const handleCreateGroup = async (newGroup) => {
        try {
            const response = await axiosInstance.post(`/users/${userId}/groups`, newGroup);
            setGroups((prevGroups) => [...prevGroups, response.data]);
            setIsModalOpen(false); // Cierra la modal después de crear el grupo
            setCreateGroupError(null); // Limpiar errores previos
        } catch (err) {
            console.error("Error creating group:", err);
            if (err.response && err.response.data) {
                setCreateGroupError(err.response.data); // Establecer mensaje de error del backend
            } else {
                setCreateGroupError("Error al crear el grupo"); // Mensaje genérico
            }
        }
    };

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow overflow-y-auto pb-24">
                    {loading && <p className="text-center">Cargando...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!loading && !error && (
                        <>
                            <GroupList
                                groups={groups}
                                noGroupsMessage="No hay grupos disponibles"
                            />
                            {/* Botón para abrir la modal */}
                            <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2">
                                <button
                                    onClick={handleOpenModal}
                                    className="p-2 flex justify-center items-center rounded-full bg-sky-500 text-white px-6 py-3 mx-5 -mb-4 hover:bg-cyan-700 focus:outline-none focus:bg-blue-500"
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
                error={createGroupError} // Pasar el error al modal
            />
        </>
    );
}
