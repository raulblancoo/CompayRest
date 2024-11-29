import React, { useState, useEffect } from "react";
import api from "./api";

function UsersList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        console.log("Estoy en use effect")
        api.get("/users").then((response) => {
            setUsers(response.data);
        });
    }, []);

    return (
        <div>
            <h1>User List</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} ({user.email})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UsersList;
