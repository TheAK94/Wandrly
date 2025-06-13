(() => {
	'use strict'

  	const forms = document.querySelectorAll('.needs-validation')

  	Array.from(forms).forEach(form => {
    	form.addEventListener('submit', event => {
			if (!form.checkValidity()) {
			event.preventDefault()
			event.stopPropagation()
		}

		form.classList.add('was-validated')
		}, false)
	})
})()

document.addEventListener("DOMContentLoaded", () => {
    const toastEl = document.querySelector('.toast');
    if (toastEl) {
        const toast = new bootstrap.Toast(toastEl, {
			delay: 7000
		});
        toast.show();
    }
});


let taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click", () => {
    let taxInfo = document.getElementsByClassName("tax-info");
	for (info of taxInfo) {
		if (info.style.display != "none") {
			info.style.display = "none";
		} else {
			info.style.display = "inline";
		}
		
	}
})
