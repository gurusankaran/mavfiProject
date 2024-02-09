//basic validate

sessionStorage.removeItem('oldAc');

const oldAccountBtn = document.querySelector('.oldAccountBtn')
oldAccountBtn.addEventListener('click',()=>{
    sessionStorage.setItem('oldAc',true);
    window.location.href = '../settings'
})


const moreOption = document.querySelector('.moreOption');
const dropDownOption = document.querySelector('.dropDownOption');

dropDownOption.hidden = true

document.addEventListener('click', function (event) {
    if (!dropDownOption.contains(event.target) && event.target !== moreOption) {
        dropDownOption.hidden = true;
        dropDownOption.style.display = 'none';
    }
});

moreOption.addEventListener('click', function (event) {
    event.stopPropagation();
    dropDownOption.hidden = !dropDownOption.hidden;
    dropDownOption.style.display = dropDownOption.hidden ? 'none' : 'flex';
});




const holderName = document.querySelector('.holderNameInput')
const holderDate = document.querySelector('.holderCreditDateInput')
const holderAmount = document.querySelector('.holderAmountInput')
const holderInterest = document.querySelector('.holderInterestInput')
const holderChitType = document.querySelector('.holderChitTypeInput')
const createHolderBtn = document.querySelector('.createHolderBtn')
const newACForm = document.querySelector('.newACForm')
const searchNameLabel = document.querySelector('.searchNameLabel')
const searchNameField = document.querySelector('.searchNameField')
const dailyCreditsBtn = document.querySelector('.dailyCreditsBtn')
const dailyCredit = document.querySelector('.dailyCredits')
const payTable = document.querySelector('.payTable')
const payTableField = document.querySelector('.payTableField')


holderName.addEventListener('input', function () {
    if (holderName.value.trim() == '') {
        return false
    }
    else {
        const nameValidate = /^[A-Z a-z]+$/;
        const NameValidateResult = nameValidate.test(holderName.value)
        if (NameValidateResult == false) {
            alert('Enter Alphabets for Name')
            holderName.value = holderName.value.slice(0, -1)
        }
    }
})

holderDate.addEventListener('change', function () {
    holderDateValidate = /^\d{4}-\d{2}-\d{2}$/
    holderDateValidateResult = holderDateValidate.test(holderDate.value);
    if (holderDateValidateResult == false) {
        alert('Feed Proper Date at Field')
        creditDateInput.value = getCurrentDate();
    }
})

holderAmount.addEventListener('change', function () {
    const holderAmountValidate = /^\d{0,}$/
    const holderAmountValidateResult = holderAmountValidate.test(holderAmount.value)
    if (holderAmountValidateResult == false || holderAmount.value < 5000) {
        alert('Enter Proper Amount')
        holderAmount.value = 10000
    }
})

holderInterest.addEventListener('change', function () {
    const holderInterestValidate = /^\d{0,}$/
    const holderInterestValidateResult = holderInterestValidate.test(holderInterest.value)
    if (holderInterestValidateResult == false || holderInterest.value < 10) {
        alert('Enter Proper Interest')
        holderInterest.value = 15
    }
})




newACForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (holderName.value.trim() == '') {
        holderName.focus()
        document.querySelector('.messageDisplay').innerHTML = 'Enter Name'
        setTimeout(() => {
            document.querySelector('.messageDisplay').innerHTML = ''
        }, 4000)
        return false;
    }
    if (holderDate.value.trim() == '') {
        holderDate.focus()
        document.querySelector('.messageDisplay').innerHTML = 'Enter Date'
        setTimeout(() => {
            document.querySelector('.messageDisplay').innerHTML = ''
        }, 4000)
        return false;
    }
    if (holderAmount.value.trim() == '') {
        holderAmount.focus()
        document.querySelector('.messageDisplay').innerHTML = 'Enter Amount'
        setTimeout(() => {
            document.querySelector('.messageDisplay').innerHTML = ''
        }, 4000)
        return false;
    }
    if (holderInterest.value.trim() == '') {
        holderInterest.focus()
        document.querySelector('.messageDisplay').innerHTML = 'Enter Interest'
        setTimeout(() => {
            document.querySelector('.messageDisplay').innerHTML = ''
        }, 4000)
        return false;
    }
    if (holderChitType.value.trim() == '') {
        holderChitType.innerHTML = `<option value="daily">Daily</option>
        <option value="week">Week</option>
        <option value="month">Month</option>`
        document.querySelector('.messageDisplay').innerHTML = 'Don\'t Change Inspect'
        setTimeout(() => {
            document.querySelector('.messageDisplay').innerHTML = ''
        }, 4000)
        return false;
    }

    


    holderRegister();

})





const newAccountLabel = document.querySelector('.newAccountLabel')
const newAccountBtn1 = document.querySelector('.newAccountBtn1')
const newAccountBtn2 = document.querySelector('.newAccountBtn2')
const headerField = document.querySelector('.headerField')

newAccountLabel.hidden = true
newAccountBtn1.addEventListener('click', function () {

    dailyCredit.hidden = true

    if (newAccountBtn1.innerHTML == 'New A/C') {
        const headerField = document.querySelector('.headerField')
    const newACForm = document.querySelector('.newACForm')
    const conformationContainer = document.querySelector('.conformationContainer')

    conformationContainer.hidden = true
    newACForm.classList.remove("blurEffect")
    payTable.classList.remove("blurEffect") 
    headerField.classList.remove("blurEffect")
    newAccountBtn1.innerHTML = 'Back'
        hideTable()
    }
    else if (newAccountBtn1.innerHTML == 'Back') {
        newAccountBtn1.innerHTML = 'New A/C'
        showTable()
    }
})

newAccountBtn2.addEventListener('click', function () {

    dailyCredit.hidden = true


    if (newAccountBtn2.innerHTML == 'New A/C') {
         const headerField = document.querySelector('.headerField')
    const newACForm = document.querySelector('.newACForm')
    const conformationContainer = document.querySelector('.conformationContainer')

    conformationContainer.hidden = true
    newACForm.classList.remove("blurEffect")
    payTable.classList.remove("blurEffect") 
    headerField.classList.remove("blurEffect")
    newAccountBtn2.innerHTML = 'Back'
        hideTable()
    }
    else if (newAccountBtn2.innerHTML == 'Back') {

    newAccountBtn2.innerHTML = 'New A/C'
        showTable()
    }
})


function showTable() {
    dailyCredit.hidden = true
    payTableField.hidden = false
    newAccountLabel.hidden = true
    newAccountLabel.style.display = 'none';
    headerField.style.marginBottom = '150px'
}

function hideTable() {
    payTableField.hidden = true
    newAccountLabel.hidden = false
    newAccountLabel.style.display = 'inline-block';
    headerField.style.marginBottom = '150px'
}


function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const creditDateInput = document.querySelector('.holderCreditDateInput');
creditDateInput.value = getCurrentDate();

document.querySelector('.settingsBtn').addEventListener('click',()=>{
    sessionStorage.setItem('oldAc',false)
    window.location.href='../settings'
})

const cancelBtn = document.querySelector('.cancelBtn')
cancelBtn.addEventListener('click',()=>{
    const headerField = document.querySelector('.headerField')
    const newACForm = document.querySelector('.newACForm')
    const conformationContainer = document.querySelector('.conformationContainer')

    conformationContainer.hidden = true
    newACForm.classList.remove("blurEffect")
    payTableField.classList.remove("blurEffect") 
    headerField.classList.remove("blurEffect")
})




