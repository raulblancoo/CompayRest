import {Link} from "react-router-dom";
import {useState} from "react";


export function Login() {
    const [isLoginActive, setIsLoginActive] = useState(true);

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
                                required
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                name="password"
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
                                required
                            />
                            <input
                                type="text"
                                placeholder="Apellidos"
                                name="surname"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Correo Electrónico"
                                name="email"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Usuario"
                                name="username"
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                name="password"
                                required
                            />
                            <button type="submit">Regístrarse</button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}