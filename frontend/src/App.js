import React, { useEffect, useState } from "react";
import GroupList from "./GroupList";
import Navbar from "./Navbar";
import axios from "axios"; // Si usas Axios

const App = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Función para obtener los datos
        const fetchGroups = async () => {
            try {
                const response = await axios.get("http://localhost:8080/users/1/groups"); // Cambiar por `fetch` si no usas Axios
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

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow overflow-y-auto pb-24">
                {loading && <p className="text-center">Loading...</p>}
                {error && ( <p className="text-center text-red-500">{error}</p>)}
                {!loading && !error && (
                    <GroupList
                        groups={groups}
                        noGroupsMessage="No groups available"
                    />
                )}
            </main>
        </div>
    );
};

export default App;
