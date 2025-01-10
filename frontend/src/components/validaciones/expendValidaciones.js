import React, { useState, useRef } from "react";

// Función para determinar el idioma según la bandera
export function determineLanguage(langFlagRef) {
    const imgSrc = langFlagRef.current?.getAttribute("src") || "";

    if (imgSrc.includes("united")) return "unit";
    if (imgSrc.includes("ita")) return "ita";
    return "sp";
}

// Función para obtener mensajes de error según el idioma
export function getErrorMessage(type, language) {
    const messages = {
        sp: {
            amountZero: "La cantidad del pago no puede ser 0.",
            emptyFields: "Ningún campo puede ir vacío.",
            distributionMismatch: "El reparto especificado no suma la cantidad total.",
            percentMismatch: "Los porcentajes especificados no suman el 100%.",
            invalidDivision: "No existe este método de división del pago.",
        },
        unit: {
            amountZero: "The payment amount cannot be 0.",
            emptyFields: "No field can be empty.",
            distributionMismatch: "The specified distribution does not sum to the total amount.",
            percentMismatch: "The specified percentage does not add up to 100%.",
            invalidDivision: "This payment division method does not exist.",
        },
        ita: {
            amountZero: "L'importo del pagamento non può essere 0.",
            emptyFields: "Nessun campo può essere vuoto.",
            distributionMismatch: "La ripartizione specificata non corrisponde all'importo totale.",
            percentMismatch: "La percentuale specificata non corrisponde al 100%.",
            invalidDivision: "Metodo di divisione del pagamento non esistente.",
        },
    };

    return messages[language][type];
}

// Función para validar la distribución
export function validateDistribution(userInputs) {
    return userInputs.every((input) => parseFloat(input) > 0);
}

// Función para sumar la distribución
export function sumDistribution(userInputs) {
    return userInputs.reduce((total, input) => total + parseFloat(input || 0), 0);
}

// Componente principal del formulario
function PaymentForm() {
    const langFlagRef = useRef(); // Ref para el elemento de la bandera del idioma

    const [formData, setFormData] = useState({
        payer: "",
        paymentAmount: "",
        paymentConcept: "",
        dividedPayment: "",
    });

    const [errors, setErrors] = useState([]);
    const [userInputs, setUserInputs] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    function handleCheckboxChange(event) {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedUsers((prev) => [...prev, value]);
        } else {
            setSelectedUsers((prev) => prev.filter((user) => user !== value));
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const validationErrors = [];
        const language = determineLanguage(langFlagRef);

        if (parseFloat(formData.paymentAmount) <= 0) {
            validationErrors.push(getErrorMessage("amountZero", language));
        }

        if (
            !formData.payer ||
            !formData.paymentAmount ||
            !formData.paymentConcept ||
            !validateDistribution(userInputs) ||
            selectedUsers.length === 0
        ) {
            validationErrors.push(getErrorMessage("emptyFields", language));
        }

        if (
            sumDistribution(userInputs) !== parseFloat(formData.paymentAmount) &&
            formData.dividedPayment === "PARTESDESIGUALES"
        ) {
            validationErrors.push(getErrorMessage("distributionMismatch", language));
        }

        if (
            sumDistribution(userInputs) !== 100 &&
            formData.dividedPayment === "PORCENTAJES"
        ) {
            validationErrors.push(getErrorMessage("percentMismatch", language));
        }

        if (
            !["PARTESIGUALES", "PARTESDESIGUALES", "PORCENTAJES"].includes(
                formData.dividedPayment
            )
        ) {
            validationErrors.push(getErrorMessage("invalidDivision", language));
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
        } else {
            console.log("Form submitted:", formData);
        }
    }

    return (
        <div>
            {/* Bandera para determinar el idioma */}
            <img
                ref={langFlagRef}
                id="main-lang-flag"
                src="spain.png"
                alt="Language flag"
            />
            <form onSubmit={handleSubmit}>
                <label>
                    Payer:
                    <input
                        name="payer"
                        value={formData.payer}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Payment Amount:
                    <input
                        name="paymentAmount"
                        value={formData.paymentAmount}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Payment Concept:
                    <input
                        name="paymentConcept"
                        value={formData.paymentConcept}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Divided Payment:
                    <select
                        name="dividedPayment"
                        value={formData.dividedPayment}
                        onChange={handleChange}
                    >
                        <option value="PARTESIGUALES">Partes Iguales</option>
                        <option value="PARTESDESIGUALES">Partes Desiguales</option>
                        <option value="PORCENTAJES">Porcentajes</option>
                    </select>
                </label>
                <div>
                    <p>Selected Users:</p>
                    {/* Render checkboxes dinámicamente */}
                </div>
                <button type="submit">Submit</button>
                {errors.length > 0 && (
                    <div>
                        <ul>
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </form>
        </div>
    );
}

export default PaymentForm;
