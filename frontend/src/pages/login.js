import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import '../login.css';


export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()
    const [isLoginActive, setIsLoginActive] = useState(true);


    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')

        const loginData = {
            name,
            surname,
            email,
            username,
            password
        }
        try {
            const response = await axios.post('http://localhost:8080/login', loginData);
            if (response.status === 200){
                navigate('/groups')
            } else {
                const errorData = await response.json()
                setError(errorData.message || 'Login failed for user. Please retry!')
            }
        } catch(error) {
            setError('And error occurred. please retry')
        }

    }

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
                        <form
                            method="post"
                            action="/login"
                            className="formulario__login"
                        >
                            <h2>Iniciar Sesión</h2>
                            <input
                                type="text"
                                placeholder="Correo Electrónico"
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
                            {/* CSRF Token si es necesario */}
                            {/* <input type="hidden" name="_csrf" value="token_value" /> */}
                            <button type="submit">Entrar</button>
                        </form>
                    )}

                    {/* Register */}
                    {!isLoginActive && (
                        <form
                            method="post"
                            action="/register"
                            className="formulario__register"
                        >
                            <h2>Regístrarse</h2>
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

            <Link to="/groups">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg focus:ring-4 focus:ring-blue-300">
                    ¡Haz clic aquí!
                </button>
            </Link>
        </main>



    );
}