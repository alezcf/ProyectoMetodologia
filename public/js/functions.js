//Login completación automática de campos

// Cuando el RUT Body termina, pasa inmediatamente al RUT dv
$('#rut').keyup(function(e) {
    if ($(this).val().length == $(this).attr('maxlength')) {
        $('#dv').focus();
    }
});

$("#dv").keyup(function(e) {
    if( $(this).val().length == $(this).attr("maxlength")) {
        $("#password").focus();
    }
});

$("#dv").keyup(function(e) {
    if( $(this).val().length == ("")){
        $('#rut').focus();
    }
});

//Verificacion todos los campos del login esten completos
const form = document.getElementById('login-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const rutInput = document.getElementById('rut');
    const dvInput = document.getElementById('dv');
    const passwordInput = document.getElementById('password');

    if (rutInput.value.trim() === '') {
        // Mostrar un mensaje de error o resaltar el campo del RUT vacío
        return;
    }

    if (dvInput.value.trim() === '') {
        // Mostrar un mensaje de error o resaltar el campo del dígito verificador vacío
        return;
    }

    if (passwordInput.value.trim() === '') {
        // Mostrar un mensaje de error o resaltar el campo de la contraseña vacío
        return;
    }

    // Si todos los campos están completos, puedes enviar el formulario o realizar otras acciones
    form.submit();
});


//Al refrescar se quitan los datos del formulario login
window.addEventListener('load', () => {
    const form = document.getElementById('login-form');

    // Restablecer el formulario al cargar la página
    form.reset();
});



