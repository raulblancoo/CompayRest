import axios from "axios";
import {HashRouter as Router, Routes, Route } from 'react-router-dom'
import {Home} from "./pages/home";
import {Login} from "./pages/login";
import {Groups} from './pages/groups'
import {Expense} from "./pages/expense";

import {Layout} from "./Layout";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route element={<Layout/>}>
                    <Route path="/groups" element={<Groups/>} />
                    <Route path="/groups/:idGroup/expenses" element={<Expense/>} />
                </Route>
            </Routes>
        </Router>
    )

}

export default App;
