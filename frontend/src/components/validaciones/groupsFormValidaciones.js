export function validateGroupName(groupName, userGroups, language = "sp") {
    const regexGroupName = /^[\x20\x21-\xA8\xAD\xE0-\xED]*$/;
    let errors = [];

    switch (language) {
        case "sp":
            if (!groupName.trim()) errors.push("El nombre del grupo es obligatorio.");
            if (groupName.length > 20) errors.push("El nombre del grupo no debe exceder 20 caracteres.");
            if (userGroups.includes(groupName)) errors.push("El nombre de este grupo ya existe.");
            if (!regexGroupName.test(groupName)) errors.push("El nombre del grupo tiene caracteres no permitidos.");
            break;

        case "ita":
            if (!groupName.trim()) errors.push("Il nome del gruppo è obbligatorio.");
            if (groupName.length > 20) errors.push("Il nome del gruppo non deve superare 20 caratteri.");
            if (userGroups.includes(groupName)) errors.push("Il nome di questo gruppo esiste già.");
            if (!regexGroupName.test(groupName)) errors.push("Il nome del gruppo contiene caratteri non consentiti.");
            break;

        case "unit":
            if (!groupName.trim()) errors.push("Group name is required.");
            if (groupName.length > 20) errors.push("Group name must not exceed 20 characters.");
            if (userGroups.includes(groupName)) errors.push("This group name already exists.");
            if (!regexGroupName.test(groupName)) errors.push("Group name contains invalid characters.");
            break;

        default:
            errors.push("Unsupported language.");
            break;
    }

    return errors;
}

export function validateEmail(email, existingEmails, userEmail, language = "sp") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errors = [];

    if (!email.trim()) {
        switch (language) {
            case "sp": errors.push("Por favor, introduce una dirección de correo válida."); break;
            case "ita": errors.push("Per favore, inserisci un indirizzo email valido."); break;
            case "unit": errors.push("Please enter a valid email address."); break;
            default: errors.push("Unsupported language.");
        }
    } else if (!emailRegex.test(email)) {
        switch (language) {
            case "sp": errors.push("El formato del correo no es válido."); break;
            case "ita": errors.push("Il formato dell'email non è valido."); break;
            case "unit": errors.push("The email format is invalid."); break;
            default: errors.push("Unsupported language.");
        }
    } else if (existingEmails.includes(email)) {
        switch (language) {
            case "sp": errors.push("Este email ya ha sido añadido."); break;
            case "ita": errors.push("Questa email è già stata aggiunta."); break;
            case "unit": errors.push("This email has already been added."); break;
            default: errors.push("Unsupported language.");
        }
    } else if (email === userEmail) {
        switch (language) {
            case "sp": errors.push("No puedes añadirte a la lista de participantes."); break;
            case "ita": errors.push("Non puoi aggiungerti alla lista dei partecipanti."); break;
            case "unit": errors.push("You cannot add yourself to the participant list."); break;
            default: errors.push("Unsupported language.");
        }
    }

    return errors;
}

export function validateCurrency(currency, allowedCurrencies = ["EURO", "DOLAR"], language = "sp") {
    let errors = [];

    if (!allowedCurrencies.includes(currency)) {
        switch (language) {
            case "sp": errors.push("La moneda seleccionada no está permitida."); break;
            case "ita": errors.push("La valuta selezionata non è consentita."); break;
            case "unit": errors.push("The selected currency is not allowed."); break;
            default: errors.push("Unsupported language.");
        }
    }

    return errors;
}

export function validateEmailList(emailList, language = "sp") {
    if (emailList.length === 0) {
        switch (language) {
            case "sp": return ["Debes añadir al menos un email antes de enviar el formulario."];
            case "ita": return ["Devi aggiungere almeno un'email prima di inviare il modulo."];
            case "unit": return ["You must add at least one email before submitting the form."];
            default: return ["Unsupported language."];
        }
    }

    return [];
}
