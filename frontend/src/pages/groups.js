import {useEffect, useState} from "react";
import GroupList from "../components/GroupList";
import axios from "axios";

export function Groups(){

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchGroups = async () => {
            try {
                // TODO: comprobar cómo se haría para pasarle qué usuario eres
                const response = await axios.get("http://localhost:8080/users/4/groups/4"); // Cambiar por `fetch` si no usas Axios
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
        <>
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow overflow-y-auto pb-24">
                    {loading && <p className="text-center">Loading...</p>}
                    {error && (<p className="text-center text-red-500">{error}</p>)}
                    {!loading && !error && (
                        <GroupList
                            groups={groups}
                            noGroupsMessage="No groups available"
                        />
                    )}
                </main>
            </div>
        </>
    )
}
