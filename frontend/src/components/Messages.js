import React, { useEffect, useState } from "react";
import axios from "axios";

function AuthContent() {
    // Estado para guardar el array o mensaje de error
    const [data, setData] = useState([]);

    useEffect(() => {
        // Simula el ngOnInit() de Angular
        axios
            .get("/messages")
            .then((response) => {
                // Guardar la respuesta en el estado
                setData(response.data);
            })
            .catch((error) => {
                // Manejo de errores (similar al catch del Angular)
                if (error?.response?.status === 401) {
                    // Por ejemplo: limpiar token, redirigir, etc.
                    console.warn("No autorizado (401).");
                } else {
                    // Guardar el código de error en el estado
                    setData(error?.response?.code || "Error desconocido");
                }
            });
    }, []);
    // El segundo argumento vacío ([]) se traduce en "haz esto sólo una vez al montar el componente"

    return (
        <div className="row justify-content-md-center">
            <div className="col-4">
                <div className="card" style={{ width: "18rem" }}>
                    <div className="card-body">
                        <h5 className="card-title">Backend response</h5>
                        <p className="card-text">Content:</p>
                        <ul>
                            {/* Si data es un array, lo mapeamos.
                  Si llega un string (ej. error), lo mostramos tal cual. */}
                            {Array.isArray(data) ? (
                                data.map((line, index) => <li key={index}>{line}</li>)
                            ) : (
                                <li>{data}</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthContent;
