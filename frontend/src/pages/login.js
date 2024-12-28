import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../components/axiosInstance";

export function Login() {
    // Estados
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoginActive, setIsLoginActive] = useState(true);

    const navigate = useNavigate();

    // LOGIN
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        // Datos que envías al endpoint
        const loginData = {
            email,
            password,
        };

        try {
            const response = await axiosInstance.post("/login", loginData);
            if (response.status === 200 ||response.status === 201) {
                const { token } = response.data;

                if (token) {
                    localStorage.setItem('token', token);
                    navigate("/groups");
                }
            } else {
                // Manejo de error
                setError("Login failed for user. Please retry!");
            }
        } catch (error) {
            setError("An error occurred. Please retry");
        }
    };

    // REGISTER
    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        const registerData = {
            name,
            surname,
            email,
            username,
            password,
        };

        try {
            // Ajusta la URL según tu backend (ej: /register)
            const response = await axiosInstance.post("/register", registerData);
            if (response.status === 200 || response.status === 201) {
                navigate("/login");
            } else {
                setError("Register failed for user. Please retry!");
            }
        } catch (error) {
            setError("An error occurred. Please retry");
        }
    };

    return (
        <main>
            <div className="contenedor__todo">
                {/* Caja trasera */}
                <div className="caja__trasera">
                    <div className="caja__trasera-login">
                        <h3>¿Ya tienes una cuenta?</h3>
                        <p>Inicia sesión para entrar en la página</p>
                        <button onClick={() => setIsLoginActive(true)} id="btn__iniciar-sesion">
                            Iniciar Sesión
                        </button>
                    </div>
                    <div className="caja__trasera-register">
                        <h3>¿Aún no tienes una cuenta?</h3>
                        <p>Regístrate para que puedas iniciar sesión</p>
                        <button onClick={() => setIsLoginActive(false)} id="btn__registrarse">
                            Regístrarse
                        </button>
                    </div>
                </div>

                {/* Contenedor de formularios */}
                <div className="contenedor__login-register">
                    {/* Login */}
                    {isLoginActive && (
                        <form onSubmit={handleLogin} className="formulario__login">
                            <h2>Iniciar Sesión</h2>
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            <input
                                type="text"
                                placeholder="Correo Electrónico"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit">Entrar</button>
                        </form>
                    )}

                    {/* Register */}
                    {!isLoginActive && (
                        <form onSubmit={handleRegister} className="formulario__register">
                            <h2>Regístrarse</h2>
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            <input
                                type="text"
                                placeholder="Nombre"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Apellidos"
                                name="surname"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Correo Electrónico"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Usuario"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit">Regístrarse</button>
                        </form>
                    )}
                </div>
            </div>

            {/* Enlace a /groups de ejemplo */}
            <Link to="/groups">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg focus:ring-4 focus:ring-blue-300">
                    ¡Haz clic aquí!
                </button>
            </Link>
        </main>
    );
}
