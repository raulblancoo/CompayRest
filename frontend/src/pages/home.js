import {Link} from "react-router-dom";

export function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-900 flex items-center justify-center">
            <div className="text-center">
                {/* Logo de ComPay */}
                <img
                    src="/frontend/src/favicon.svg"
                    alt="ComPay Logo"
                    className="w-16 h-16 mx-auto mb-6"
                />

                {/* Título con icono */}
                <h1 className="text-white text-5xl font-bold flex items-center justify-center gap-2 mb-6">
                    ComPay
                </h1>

                {/* Botón centrado */}
                <Link to="/login">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg focus:ring-4 focus:ring-blue-300">
                        ¡Haz clic aquí!
                    </button>
                </Link>
            </div>
        </div>
    );
}