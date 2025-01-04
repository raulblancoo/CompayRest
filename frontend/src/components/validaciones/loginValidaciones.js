document.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.getElementById("login-form");
    const formRegister = document.getElementById("register-form");

    const errorLoginContainer = document.createElement("div");
    errorLoginContainer.style.color = "#dc2626";
    errorLoginContainer.style.marginTop = "10px";

    formLogin.appendChild(errorLoginContainer);

    const errorRegisterContainer = document.createElement("div");
    errorRegisterContainer.style.color = "#dc2626";
    errorRegisterContainer.style.marginTop = "10px";

    formRegister.appendChild(errorRegisterContainer);



    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexNames = /^[\x21-\xA8\xAD\xE0-\xED]*$/;

    function validacionesLogin() {
        let errors = [];

        const loginEmail = document.getElementById("loginEmail").value;
        const loginPsw = document.getElementById("loginPsw").value;

        if (!loginEmail.trim()) {
            errors.push("El email no puede ir vacío.");
        } else if (!emailRegex.test(loginEmail)) {
            errors.push("El formato del email es incorrecto.");
        }

        if (!loginPsw.trim()) {
            errors.push("La contraseña no puede ir vacía.");
        }

        return errors;
    }

    function validacionesRegister() {
        let errors = [];

        const registerName = document.getElementById("registerName").value;
        const registerEmail = document.getElementById("registerEmail").value;
        const registerUserName = document.getElementById("registerUserName").value;
        const registerSurName = document.getElementById("registerSurname").value;
        const registerPsw = document.getElementById("registerPsw").value;

        if (!regexNames.test(registerName) || !regexNames.test(registerUserName) || !regexNames.test(registerSurName)) {
            errors.push("Caracter introducido inválido.");
        }
        if (registerName.length > 20 || registerUserName.length > 20 || registerSurName.length > 20) {
            errors.push("El tamaño máximo por campo es de 20 caracteres.");
        }
        if (!registerName.trim() || !registerUserName.trim() || !registerPsw.trim() || !registerEmail.trim() || !registerSurName.trim()) {
            errors.push("Ningún campo puede ir vacío.");
        } else if (!emailRegex.test(registerEmail)) {
            errors.push("El formato del email es incorrecto.");
        }

        return errors;
    }


    formLogin.addEventListener("submit", function (event) {
        event.preventDefault();
        errorLoginContainer.innerHTML = "";
        const loginErrors = validacionesLogin();

        if (loginErrors.length > 0) {
            errorLoginContainer.innerHTML = loginErrors.map(error => `${error}</p>`).join("");
        } else {
            formLogin.submit();
        }
    });


    formRegister.addEventListener("submit", function (event) {
        event.preventDefault();
        errorRegisterContainer.innerHTML = "";
        const registerErrors = validacionesRegister();

        if (registerErrors.length > 0) {
            errorRegisterContainer.innerHTML = registerErrors.map(error => `${error}</p>`).join("");
        } else {
            formRegister.submit();
        }
    });
});
