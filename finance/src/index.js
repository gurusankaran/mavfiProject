sessionStorage.clear();

const regiMobile = document.getElementsByName('regiMobileInput')[0];

regiMobile.addEventListener('input', () => {
    regiMobile.value = regiMobile.value.slice(0, 10);
})

function regiSubmit(event) {
    event.preventDefault();


    const sample_image = document.getElementsByName('regiImageInput')[0];
    const file = sample_image.files[0];

    validateName();
    validateEmail();
    validatePassword();
    validateMobile();

    if (file) {
        if (validateFile(file)) {
            upload(file);
        } else {
            alert('Upload only jpg, jpeg, png format');
        }
    }
    else {
        alert('Feed Image');
    }
}

function validateName() {
    const regiName = document.getElementsByName('regiNameInput')[0];
    const nameValue = regiName.value.trim();
    if (!nameValue) {
        alert('Name cannot be empty');
    }
    else
        return regiName;
}

function validateEmail() {
    const regiEmail = document.getElementsByName('regiEmailInput')[0];
    const emailValue = regiEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailValue)) {
        alert('Invalid email format');
        regiEmail.value = '';
    } else if (containsSQLKeywords(emailValue)) {
        alert('Invalid email. Please avoid using SQL keywords.');
        regiEmail.value = '';
    } else {
        regiEmail.textContent = emailValue;
        return regiEmail;
    }
}


function validatePassword() {
    const regiPassword = document.getElementsByName('regiPasswordInput')[0];
    const passwordValue = regiPassword.value;
    if (!passwordValue || /^\s*$/.test(passwordValue)) {
        alert('Password cannot be null or empty spaces');
    }
    else
        return regiPassword;
}

function validateMobile() {
    const regiMobile = document.getElementsByName('regiMobileInput')[0];
    const mobileValue = regiMobile.value.trim();
    const mobileRegex = /^\d{1,10}$/;

    if (mobileValue.length > 10) {
        alert('Mobile must not exceed 10 digits');
        regiMobile.value = mobileValue.slice(0, 10);
    } else if (!mobileRegex.test(mobileValue)) {
        alert('Mobile must contain only numerical digits');
    }
    else
        return regiMobile;
}

const validateFile = (file) => {
    return ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
};

const upload = (file) => {
    const formName = validateName();
    const formEmail = validateEmail();
    const formPassword = validatePassword();
    const formMobile = validateMobile();

    if (!formName || !formEmail || !formPassword || !formMobile) {
        return console.log('error');
    }

    const form_data = new FormData();
    form_data.append('reason', 'signup');
    form_data.append('regiName', formName.value);
    form_data.append('regiEmail', formEmail.value);
    form_data.append('regiPassword', formPassword.value);
    form_data.append('regiMobile', formMobile.value);

    form_data.append('sample_image', file);
    document.querySelector('.circleLoading').hidden = false
    fetch("./src/php/index.php", {
        method: "POST",
        body: form_data
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (responseData) {
            if (responseData === 'Already Registered') {
    document.querySelector('.circleLoading').hidden = true
                document.querySelector('.displayMsg').innerHTML = 'Already Registered';

                document.querySelector('#name').value = null
                document.querySelector('#email').value = null
                document.querySelector('#password').value = null
                document.querySelector('#mobile').value = null
                document.querySelector('#image').value = null

                setTimeout(() => {
                    document.querySelector('.displayMsg').innerHTML = null
                }, 5000);
            }
            else if (responseData === 'Registered Successfully') {
                document.querySelector('.displayMsg').innerHTML = 'Successfully Registered';

                document.querySelector('#name').value = null
                document.querySelector('#email').value = null
                document.querySelector('#password').value = null
                document.querySelector('#mobile').value = null
                document.querySelector('#image').value = null

                setTimeout(() => {
                    document.querySelector('.displayMsg').innerHTML = null
                }, 5000);
            }
        })
        .catch(function(err){
    document.querySelector('.circleLoading').hidden = true

            console.log(err)
        })
};

const sample_image = document.getElementsByName('regiImageInput')[0];
sample_image.addEventListener('change', () => {
    const file = sample_image.files[0];
    if (file) {
        if (!validateFile(file)) {
            alert('Upload only jpg, jpeg, png format');
            sample_image.value = null;
        }
    }
});


const registrationForm = document.querySelector('.regiForm');
registrationForm.addEventListener('submit', regiSubmit);

const loginForm = document.querySelector('.loginForm');
loginForm.addEventListener('submit', loginSubmit);

//login ku coding

function containsSQLKeywords(input) {
    const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE'];
    return sqlKeywords.some(keyword => input.toUpperCase().includes(keyword));
}


var loginPassword = document.querySelector('#loginPassword');



function loginSubmit(event) {
    event.preventDefault();
    var loginEmail = document.getElementsByName('loginEmailInput')[0];
    var loginPassword = document.getElementsByName('loginPasswordInput')[0];

    const emailValue = loginEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    function loginEmailValid() {
        if (!emailRegex.test(emailValue)) {
            alert('Invalid email format');
            loginEmail.value = '';
        } else if (containsSQLKeywords(emailValue)) {
            alert('Invalid email. Please avoid using SQL keywords.');
            loginEmail.value = '';
        }
        else {
            return loginEmail;
        }
    }

    function loginPasswordValid() {
        if (loginPassword.value.trim() === '') {
            alert('Enter Password');
            loginPassword.value = null
        }
        else {
            return loginPassword;
        }
    }

    const loginEmailValidate = loginEmailValid();
    const loginPasswordValidate = loginPasswordValid();

    if (loginEmailValidate && loginPasswordValidate) {
        const form_data_login = new FormData();
        form_data_login.append('reason', 'login');
        form_data_login.append('email', loginEmailValidate.value)
        form_data_login.append('password', loginPasswordValidate.value);
    document.querySelector('.circleLoading').hidden = false
    document.querySelector('.SectionPara').classList.add("blurEffect")
    document.querySelector('.regContainer').classList.add("blurEffect")
    document.querySelector('.loginContainer').classList.add("blurEffect")
    document.querySelector('.verticalLine').classList.add('blurEffect')
        fetch('./src/php/index.php',{
            method:"POST",
            body:form_data_login
        })
        .then(function(response){
            return response.json()
        })
        .then(function(responseData){
    document.querySelector('.circleLoading').hidden = true
    document.querySelector('.SectionPara').classList.remove("blurEffect")
    document.querySelector('.regContainer').classList.remove("blurEffect")
    document.querySelector('.loginContainer').classList.remove("blurEffect")
    document.querySelector('.verticalLine').classList.remove('blurEffect')
            if(responseData.final === "No user"){
                document.querySelector('.displayMsgLogin').innerHTML='No user Found'
                document.querySelector('#loginEmail').value = null
                document.querySelector('#loginPassword').value = null
                setTimeout(()=>{
                    document.querySelector('.displayMsgLogin').innerHTML = null
                },4000)
            }
            else if(responseData.final === "password wrong"){
                document.querySelector('.displayMsgLogin').innerHTML='Wrong Password'
                document.querySelector('#loginPassword').value = null
                setTimeout(()=>{
                    document.querySelector('.displayMsgLogin').innerHTML = null
                },4000)
            }
            else if(responseData.final === "Password Validated"){
                sessionStorage.setItem('userEmail',responseData.email);
                sessionStorage.setItem('userPassword',responseData.password)
                window.location.href='./content/'
                // console.log(responseData.password)
            }
            else if(responseData.final === "Sorry This account was Blocked for security Purpose"){
                document.querySelector('.displayMsgLogin').innerHTML='Sorry This account were Blocked for security Purpose'
            }
            else if(responseData.final === "Please Wait For validate your Account"){
                document.querySelector('.displayMsgLogin').innerHTML='Please Wait For validate your Account'
                setTimeout(()=>{
                    document.querySelector('.displayMsgLogin').innerHTML = null
                },4000)
            }


            else{
                document.querySelector('.displayMsgLogin').innerHTML='Something Went Wrong'
                setTimeout(()=>{
                    document.querySelector('.displayMsgLogin').innerHTML = null
                },4000)
                console.log(responseData.final);
            }
        })
        .catch(function(error){
    document.querySelector('.circleLoading').hidden = true
    document.querySelector('.SectionPara').classList.remove("blurEffect")
    document.querySelector('.regContainer').classList.remove("blurEffect")
    document.querySelector('.loginContainer').classList.remove("blurEffect")
    document.querySelector('.verticalLine').classList.remove('blurEffect')
            document.querySelector('.displayMsgLogin').innerHTML='Something Went Wrong'
            console.log(error);
        })
    }

}