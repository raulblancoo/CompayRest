import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // Asegúrate de que es tu URL base
});

// Interceptor para añadir el token a cada petición
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("No hay token");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
