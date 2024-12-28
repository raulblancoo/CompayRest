import {jwtDecode} from "jwt-decode";

export const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const decoded = jwtDecode(token);
            return decoded.userId || decoded.id; // AJUSTA SEGÚN LA ESTRUCTURA DE TU TOKEN
        } catch (err) {
            console.error("Error decoding token:", err);
            return null;
        }
    }
    return null;
};