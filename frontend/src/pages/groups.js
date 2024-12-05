// import { useEffect, useState } from "react";
// import GroupList from "../components/GroupList";
// import GroupModal from "../components/GroupModal"; // Importar el componente reutilizable
// import axios from "axios";
//
// export function Groups() {
//     const [groups, setGroups] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [selectedGroup, setSelectedGroup] = useState(null);
//
//     // Fetch inicial de grupos
//     useEffect(() => {
//         const fetchGroups = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8080/users/1/groups");
//                 setGroups(response.data);
//                 setLoading(false);
//             } catch (err) {
//                 console.error("Error fetching groups:", err);
//                 setError("Failed to fetch groups");
//                 setLoading(false);
//             }
//         };
//
//         fetchGroups();
//     }, []);
//
//     // Manejo de la modal de creación
//     const handleOpenModal = () => setIsModalOpen(true);
//     const handleCloseModal = () => setIsModalOpen(false);
//
//     const handleCreateGroup = async (newGroup) => {
//         try {
//             const response = await axios.post("http://localhost:8080/users/1/groups", newGroup);
//             setGroups((prevGroups) => [...prevGroups, response.data]);
//             handleCloseModal();
//         } catch (err) {
//             console.error("Error creating group:", err);
//             alert("Failed to create group");
//         }
//     };
//
//     // Manejo de la modal de edición
//     const handleOpenEditModal = (group) => {
//         setSelectedGroup(group);
//         setIsEditModalOpen(true);
//     };
//
//     const handleCloseEditModal = () => {
//         setSelectedGroup(null);
//         setIsEditModalOpen(false);
//     };
//
//     const handleUpdateGroup = async (updatedGroup) => {
//         try {
//             const response = await axios.put(
//                 `http://localhost:8080/users/1/groups/${selectedGroup.id}`,
//                 updatedGroup
//             );
//             setGroups((prevGroups) =>
//                 prevGroups.map((group) =>
//                     group.id === selectedGroup.id ? response.data : group
//                 )
//             );
//             handleCloseEditModal();
//         } catch (err) {
//             console.error("Error updating group:", err);
//             alert("Error updating group");
//         }
//     };
//
//     return (
//         <>
//             <div className="flex flex-col min-h-screen">
//                 <main className="flex-grow overflow-y-auto pb-24">
//                     {loading && <p className="text-center">Loading...</p>}
//                     {error && <p className="text-center text-red-500">{error}</p>}
//                     {!loading && !error && (
//                         <>
//                             <GroupList
//                                 groups={groups}
//                                 noGroupsMessage="No groups available"
//                                 onEditGroup={handleOpenEditModal} // Pasamos la función de edición
//                             />
//                             {/* Botón para abrir la modal de creación */}
//                             <div className="flex justify-center mt-8">
//                                 <button
//                                     onClick={handleOpenModal}
//                                     className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
//                                 >
//                                     Crear Grupo
//                                 </button>
//                             </div>
//                         </>
//                     )}
//                 </main>
//             </div>
//
//             {/* Modal de creación */}
//             <GroupModal
//                 isOpen={isModalOpen}
//                 onClose={handleCloseModal}
//                 onSubmit={handleCreateGroup}
//                 showEmails={true} // Mostrar campo de emails
//             />
//
//             {/* Modal de edición */}
//             <GroupModal
//                 isOpen={isEditModalOpen}
//                 onClose={handleCloseEditModal}
//                 onSubmit={handleUpdateGroup}
//                 initialValues={{
//                     groupName: selectedGroup?.groupName || "",
//                     currency: selectedGroup?.currency || "EURO",
//                 }}
//                 showEmails={false} // No mostrar emails en la edición
//             />
//         </>
//     );
// }


import { useEffect, useState } from "react";
import GroupList from "../components/GroupList";
import axios from "axios";
import Modal from "../components/Modal"; // Asegúrate de importar el componente Modal

export function Groups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para la modal

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
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleCreateGroup}
            />
        </>
    );
}
