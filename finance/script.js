const password = document.querySelector('.password')
const eyeIcon = document.querySelector('.fa') //to access fa element include fa-eye and fa-eye-slash
const loginContainer = document.querySelector('.loginContainer')
const SectionPara = document.querySelector('.SectionPara')
const regContainer = document.querySelector('.regContainer')

//show password function
function togglePassword() {
    eyeIcon.classList.toggle('fa-eye')
    eyeIcon.classList.toggle('fa-eye-slash')
    if (password.type == 'password') {
        password.type = 'text'
        password.focus()
    }
    else if (password.type == 'text') {
        password.type = 'password'
        password.focus()
    }
}

function changeTo(state) {
    if (state === 'signup') {
        loginContainer.hidden = true
        SectionPara.style.float = "right"
        regContainer.hidden = false
    }
    else if (state === 'login') {
        loginContainer.hidden = false
        SectionPara.style.float = "left"
        regContainer.hidden = true
    }
}
 
