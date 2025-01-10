document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("editPaymentForm");

    const payerSelect = document.getElementById("edit_payer_select");
    const pagoCantidad = document.getElementById("edit_payment_amount");
    const conceptoPago = document.getElementById("edit_payment_amount");
    const dividedPayment = document.getElementById("edit_divided_payment");


    const generalErrorContainer = document.getElementById("editDivErrores");
    generalErrorContainer.style.display = "none";

    function addErrorMessage(message) {
        const errorList = generalErrorContainer.querySelector("ul");
        const existingErrors = Array.from(errorList.children).map(item => item.textContent);
        if (!existingErrors.includes(message)) {
            const errorItem = document.createElement("li");
            errorItem.textContent = message;
            errorList.appendChild(errorItem);
        }
    }

    form.addEventListener("submit", function (event){
        const imgElement = document.getElementById("main-lang-flag").getAttribute("src");
        language = "sp";
        event.preventDefault();
        let errors = [];

        generalErrorContainer.querySelector("ul").innerHTML = "";
        generalErrorContainer.style.display = "none";
        if(imgElement.includes("united")){
            language = "unit";
        }else if(imgElement.includes("ita")){
            language = "ita";
        }
        switch (language) {
            case "sp": // Español
                if (pagoCantidad.value <= 0) {
                    errors.push("La cantidad del pago no puede ser 0.");
                }
                if (!payerSelect.value.trim() || !pagoCantidad.value.trim() || !conceptoPago.value.trim() || !validarReparto() || !comprobacionCheckbox()) {
                    errors.push("Ningún campo puede ir vacío.");
                } else if (sumasReparto() != pagoCantidad.value &&  dividedPayment.value == "PARTESDESIGUALES") {
                    errors.push("El reparto especificado no suma la cantidad total");
                }else if(sumasReparto() != 100 &&  dividedPayment.value == "PORCENTAJES"){
                    errors.push("Los porcentajes especificado no suma el 100%");
                }
                if (dividedPayment.value !== "PARTESIGUALES" && dividedPayment.value !== "PARTESDESIGUALES" && dividedPayment.value !== "PORCENTAJES") {
                    errors.push("No existe este método de división del pago.");
                }
                break;

            case "ita": // Italiano
                if (pagoCantidad.value <= 0) {
                    errors.push("L'importo del pagamento non può essere 0.");
                }
                if (!payerSelect.value.trim() || !pagoCantidad.value.trim() || !conceptoPago.value.trim() || !validarReparto() || !comprobacionCheckbox()) {
                    errors.push("Nessun campo può essere vuoto.");
                } else if (sumasReparto() != pagoCantidad.value &&  dividedPayment.value == "PARTESDESIGUALES") {
                    errors.push("La ripartizione specificata non corrisponde all'importo totale.");
                }
                else if(sumasReparto() != 100 &&  dividedPayment.value == "PORCENTAJES"){
                    errors.push("El porsintage specificata non corrisponde all cen por cento.");
                }
                if (dividedPayment.value !== "PARTESIGUALES" && dividedPayment.value !== "PARTESDESIGUALES" && dividedPayment.value !== "PORCENTAJES") {
                    errors.push("Metodo di divisione del pagamento non esistente.");
                }
                break;

            case "unit": // Inglés
                if (pagoCantidad.value <= 0) {
                    errors.push("The payment amount cannot be 0.");
                }
                if (!payerSelect.value.trim() || !pagoCantidad.value.trim() || !conceptoPago.value.trim() || !validarReparto() || !comprobacionCheckbox()) {
                    errors.push("No field can be empty.");
                } else if (sumasReparto() != pagoCantidad.value &&  dividedPayment.value == "PARTESDESIGUALES") {
                    errors.push("The specified distribution does not sum to the total amount.");
                }
                else if(sumasReparto() != 100 &&  dividedPayment.value == "PORCENTAJES"){
                    errors.push("The specified porcentage does not add up to 100%.");
                }
                if (dividedPayment.value !== "PARTESIGUALES" && dividedPayment.value !== "PARTESDESIGUALES" && dividedPayment.value !== "PORCENTAJES") {
                    errors.push("This payment division method does not exist.");
                }
                break;
            default:
                break;
        }
        if (errors.length > 0) {
            generalErrorContainer.style.display = "block";
            errors.forEach(error => addErrorMessage(error));
        } else {
            form.submit();
        }

    });
    function comprobacionCheckbox(){

        const checkboxes = document.querySelectorAll('input[name="destinationUsers"]');


        const selectedUsers = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        if (selectedUsers.length > 0) {
            return true;
        } else {
            return false;
        }


    }
    function validarReparto() {
        const inputsReparto = document.querySelectorAll("#userValuesForm input[type='number']");
        for (let input of inputsReparto) {
            if (input.value === "" || parseFloat(input.value) <= 0) {
                return false;
            }
        }
        return true;
    }
    function sumasReparto(){
        totalEnteredAmount = 0;
        document.querySelectorAll('.edit-user-input').forEach(input => {
            totalEnteredAmount += parseFloat(input.value) || 0;
        });
        return totalEnteredAmount;
    }


});


