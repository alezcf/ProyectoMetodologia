//Login completación automática de campos
const rutInput = document.getElementById('rut');
const dvInput = document.getElementById('dv');

function moveToNextField() {
        if (this.value.length >= this.maxLength) {
            if (this === rutInput) {
                dvInput.focus();
            } 
    }
}

rutInput.addEventListener('rut', moveToNextField);
dvInput.addEventListener('dv', moveToNextField);

