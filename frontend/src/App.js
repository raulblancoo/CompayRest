import React, { useEffect, useState } from "react";
import GroupList from "./components/GroupList";
import Navbar from "./components/Navbar";
import axios from "axios";

import {HashRouter as Router, Routes, Route } from 'react-router-dom'
import {Home} from "./pages/home";
import {Login} from "./pages/login";
import {Groups} from './pages/groups'
import {Expense} from "./pages/expense";

import {Layout} from "./Layout";



// const App = () => {
//     const [groups, setGroups] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//
//     useEffect(() => {
//         // Función para obtener los datos
//         const fetchGroups = async () => {
//             try {
//                 // TODO: comprobar cómo se haría para pasarle qué usuario eres
//                 const response = await axios.get("http://localhost:8080/users/4/groups"); // Cambiar por `fetch` si no usas Axios
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
//     return (
//         <div className="flex flex-col min-h-screen">
//             <Navbar />
//             <main className="flex-grow overflow-y-auto pb-24">
//                 {loading && <p className="text-center">Loading...</p>}
//                 {error && ( <p className="text-center text-red-500">{error}</p>)}
//                 {!loading && !error && (
//                     <GroupList
//                         groups={groups}
//                         noGroupsMessage="No groups available"
//                     />
//                 )}
//             </main>
//         </div>
//     );
// };

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route element={<Layout/>}>
                    <Route path="/expenses" element={<Expense/>} />
                    <Route path="/groups" element={<Groups/>} />
                </Route>
            </Routes>
        </Router>
    )

}

export default App;
