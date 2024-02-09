const indexPath = "/project"
const userEmail = sessionStorage.userEmail;

var tableHeadLoading = `<th>pay</th>
<th>Name</th>
<th class="payInput">Amount</th>
<th>Total Amount</th>
<th class="details">More</th>`;

var tableBodyLoading = `<tr>
    <td class="loading">
        <div class="loadingAnimation"></div>
    </td>
    <td class="loading">
        <div class="loadingAnimation"></div>
    </td>
    <td class="loading">
        <div class="loadingAnimation"></div>
    </td>
    <td class="loading">
        <div class="loadingAnimation"></div>
    </td>
    <td class="loading">
        <div class="loadingAnimation"></div>
    </td>
</tr>
<tr>
    <td class="loading">
        <div class="loadingAnimation"></div>
    </td>
    <td class="loading">
        <div class="loadingAnimation"></div>
    </td>
    <td class="loading">
        <div class="loadingAnimation"></div>
    </td>
    <td class="loading">
        <div class="loadingAnimation"></div>
    </td>
    <td class="loading">
        <div class="loadingAnimation"></div>
    </td>
</tr>
<tr>
    <td class="loading">
        <div class="loadingAnimation"></div>
    </td>
    <td class="loading">
        <div class="loadingAnimation"></div>
    </td>
    <td class="loading">
        <div class="loadingAnimation"></div>
    </td>
    <td class="loading">
        <div class="loadingAnimation"></div>
    </td>
    <td class="loading">
        <div class="loadingAnimation"></div>
    </td>
</tr>
`;



var tableBody = document.querySelector('.tableBody');
var tableHead = document.querySelector('.tableHead');
var dailyCreditsBody = document.querySelector('.dailyCreditsBody');

tableHead.innerHTML = tableHeadLoading
tableBody.innerHTML = tableBodyLoading
dailyCreditsBody.innerHTML = tableBodyLoading


if (sessionStorage.length == 0) {
    window.location.href = indexPath + "/finance"
    console.log('redirect')
}
else if (sessionStorage.length > 0) {
    const userEmail = sessionStorage.userEmail;
    const userPassword = sessionStorage.userPassword;

    const data_form = new FormData();
    data_form.append('reason', 'contentValidate')
    data_form.append('userEmail', userEmail)
    data_form.append('userPassword', userPassword)

    fetch('./src/php/index.php', {
        method: 'POST',
        body: data_form
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (contentValidateData) {
            if (contentValidateData.final == 'noUserFound') {
                window.location.href = indexPath + "/finance"
            }
            else if (contentValidateData.final == 'wrongPassword') {
                window.location.href = indexPath + "/finance"
            }
            else if (contentValidateData.final == 'userFound') {
                dailyChangeStatus();
                tableData(chitType,'null');
            }
            else {
                console.log(contentValidateData)
            }
        })
        .catch(function(err){
            console.log(err)
        })
}

function holderRegister() {
    const userEmail = sessionStorage.userEmail;

    const holderDataForm = new FormData();
    holderDataForm.append('reason', 'holderRegister')
    holderDataForm.append('holderName', holderName.value)
    holderDataForm.append('holderDate', holderDate.value)
    holderDataForm.append('holderAmount', holderAmount.value)
    holderDataForm.append('holderInterest', holderInterest.value)
    holderDataForm.append('holderChitType', holderChitType.value)
    holderDataForm.append('adminEmail', userEmail)

    // console.log(holderChitType.value)

    fetch('./src/php/index.php', {
        method: "POST",
        body: holderDataForm
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (responseData) {
            if (responseData.final == 'alreadyCreated') {
                document.querySelector('.messageDisplay').innerHTML = 'Already Created'
                holderName.value = ''
                setTimeout(() => {
                    document.querySelector('.messageDisplay').innerHTML = ''
                    // showTable()
                    tableData(chitType,'null')
                }, 4000)
            }
            else if (responseData.final == 'inserted') {
                document.querySelector('.messageDisplay').innerHTML = 'Successfully Created'
                holderName.value = ''
                setTimeout(() => {
                    document.querySelector('.messageDisplay').innerHTML = ''
                    // showTable()
                    tableData(chitType)
                }, 4000)
            }


            else {
                console.log(responseData)
            }

            setTimeout(() => {
                document.querySelector('.messageDisplay').innerHTML = ''
            }, 4000)
        })
        .catch(function(err){
            console.log(err)
        })
}

const chitType = document.querySelector('.chitType')

chitType.addEventListener('click', function () {
    showTable(chitType)
    tableData(chitType,'null')
})

const searchName = document.querySelector('.searchNameField')
searchName.addEventListener('input',()=>{
    if(searchName.value.trim()=='' || searchName.value=='undefined'){
        tableData(chitType,'null')
    }
    else{
    tableData(chitType,searchName.value)
    }
    // console.log(chitType.value)
    // console.log(searchName.value)
})

function tableData(chitType,searchName) {
    var temp = '';
   
    const form_data = new FormData();
    form_data.append('reason', 'tableData')
    form_data.append('userEmail', userEmail)
    form_data.append('chitTypeValue', chitType.value)
    // console.log(chitType.value)

    if(searchName=='null'){
        form_data.append('searchName','null')
    }
    else{
        form_data.append('searchName',searchName)
    }
    // console.log(searchName)

    

    fetch('./src/php/index.php', {
        method: "POST",
        body: form_data
    },
    )
        .then(function (response) {
            return response.json()
        })
        .then(function (responseData) {

            tableHead.innerHTML = tableHeadLoading

            if (responseData.final == 'tableDataPresent') {
                for (const item of responseData.data) {
                    temp += `
                        <tr>
                            <td><button value="${item['id']}" class='payBtn Btn'>Pay</button></td>
                            <td><label id=${item['id']} class='payName'>${item['name']}</label></td>
                            <td><input type='number' class='payInput' value=${item['totalAmount'] / 100} id=${item['id']} /></td>
                            <td><label id=${item['id']}>${item['totalAmount']}</label></td>
                            <td><button value="${item['id']}" class='Btn moreBtn'>More</button></td>
                        </tr>
                    `;
                }

                tableBody.innerHTML = temp;

                document.querySelectorAll('.payBtn').forEach(button => {
                    button.addEventListener('click', (event) => {

                        const headerField = document.querySelector('.headerField')
                        const loadingDemo = document.querySelector('.loadingDemo')
                        const newACForm = document.querySelector('.newACForm')
                        const conformationContainer = document.querySelector('.conformationContainer')
                        const conformationAmount = document.querySelector('.conformationAmount')
                        const conformationName = document.querySelector('.conformationName');
                        

                        conformationContainer.hidden = false
                        newACForm.classList.add("blurEffect")
                        loadingDemo.classList.add("blurEffect") 
                        headerField.classList.add("blurEffect")

                        const itemId = event.target.value;
                        
                        const inputAmount = document.querySelector(`.payInput[id="${itemId}"]`);
                        const inputName = document.querySelector(`.payName[id="${itemId}"]`)

                        conformationAmount.innerHTML=inputAmount.value
                        conformationName.innerHTML = inputName.innerHTML
                
                        // console.log(itemId + " Pay, Input Value: " + inputAmount.value + inputName.innerHTML);

                        const doneBtn = document.querySelector('.doneBtn')
                        doneBtn.addEventListener('click',()=>{
                            const form_data = new FormData()
                            form_data.append('reason',"credit")
                            form_data.append('adminEmail',sessionStorage.userEmail)
                            form_data.append('inputId',itemId)
                            form_data.append('inputName',inputName.innerHTML)
                            form_data.append('chitType',chitType.value)
                            form_data.append('inputAmount',inputAmount.value)
                            
                            // console.log(chitType.value)

                            fetch('./src/php/index.php',{
                                method:'POST',
                                body:form_data
                            })
                            .then(function(response){
                                return response.json()
                            })
                            .then(function(responseData){
                                if(responseData=='updated'){
                                    conformationContainer.hidden = true
                                    newACForm.classList.remove("blurEffect")
                                    loadingDemo.classList.remove("blurEffect") 
                                    headerField.classList.remove("blurEffect")
                                    tableData(chitType,'null')
                                    // console.log(chitType)
                                    // window.top.location.reload(true)
                                }
                                else{
                                    console.log(responseData)
                                }
                            })
                            .catch(error=>{
                                console.log(error)
                            })
                        })

                        });
                });

                document.querySelectorAll('.moreBtn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const itemId = event.target.value;
                        const payName = document.querySelector(`.payName[id="${itemId}"]`).innerHTML
                        


                        sessionStorage.setItem('chitType',chitType.value);
                        sessionStorage.setItem('id',itemId)
                        sessionStorage.setItem('name',payName);

                        window.location.href='../moreDetails/'

                        // console.log(payName)


                    });
                });

            }

            else if (responseData.final == 'noTableData') {
                tableHead.innerHTML = ''
                tableBody.innerHTML = "No Data Found"
            }

            else {
                console.log(responseData)
            }
        })
        .catch(function(err){
            console.log(err)
        })




}



const logoutBtn1 = document.querySelector('.logout1')
logoutBtn1.addEventListener('click',function(){
    sessionStorage.clear();
    window.location.reload();
})
const logoutBtn2 = document.querySelector('.logout2')
logoutBtn2.addEventListener('click',function(){
    sessionStorage.clear();
    window.location.reload();
})

function dailyChangeStatus(){
    var date = new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'})
                date = date.split(',')
                lastDate = date[0];
                lastTime = date[1];
                // localStorage.setItem('lastDate',lastDate)
                // localStorage.setItem('lastTime',lastTime)

                if(localStorage.lastDate!=lastDate){
                        const form_data = new FormData();
                        form_data.append('reason','changeStatus')
                        form_data.append('adminEmail',sessionStorage.userEmail)
                        
                        fetch('./src/php/index.php',{
                            method:"POST",
                            body:form_data
                        })
                        .then(function(response){
                            return response.json()
                        })
                        .then(function(responseData){
                            if(responseData=='statusUpdated'){
                                localStorage.setItem('lastDate',lastDate)
                                localStorage.setItem('lastTime',lastTime)
                            }
                            // console.log(responseData)
                        })
                }
                // console.log(sessionStorage.userEmail)
}


function dailyCreditBtnFunction(){
    newAccountBtn1.innerHTML = 'New A/C'
    if(dailyCredit.hidden == true){
        dailyCredit.hidden = false
        newAccountLabel.hidden = true
        payTableField.hidden = true
        // console.log(chitType.value)

        const form_data = new FormData();
        form_data.append('adminEmail',sessionStorage.userEmail)
        form_data.append('chitType',chitType.value)
        form_data.append('reason','dailyCredits')

        fetch('./src/php/index.php',{
            method:"POST",
            body: form_data
        })
        .then(function(response){
            return response.json()
        })
        .then(function todayCredits(responseData){
            var temp = ''
            if(responseData=='noData'){
                temp = `
                    <tr><td colspan=5>No Record Found</td></tr>
                `;
                dailyCreditsBody.innerHTML = temp
            }
            else{
                for(var i in responseData){
                    temp +=`
                        <tr>
                            <td><button value='${responseData[i].id}' class='Btn updateBtn' id='${responseData[i].id}'>Update</button></td>
                            <td class='creditName' id='${responseData[i].id}'>${responseData[i].name}</td>
                            <td class='creditAmountLabel' id='${responseData[i].id}'><label class='creditAmount' id='${responseData[i].id}'>${responseData[i].amount}</label></td>
                            <td class='creditAmountInputLabel id='${responseData[i].id}' hidden><input class='creditAmountInput' id='${responseData[i].id}' value='${responseData[i].amount}'></td>
                            <td class='creditTotalAmount' id='${responseData[i].id}'>${responseData[i].totalAmount}</td>
                            <td><button value='${responseData[i].id}' class='Btn moreBtn' id='${responseData[i].id}'>More</button></td>
                        </tr>
                    `;
                }
                dailyCreditsBody.innerHTML = temp

                document.querySelectorAll('.moreBtn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const itemId = event.target.value;
                        const payName = document.querySelector(`.creditName[id="${itemId}"]`).innerHTML
                        


                        sessionStorage.setItem('chitType',chitType.value);
                        sessionStorage.setItem('id',itemId)
                        sessionStorage.setItem('name',payName);

                        window.location.href='../moreDetails/'
                    });
                });

                
                    // Add click event listener to update buttons
                    const updateBtns = document.querySelectorAll('.updateBtn');
                    updateBtns.forEach(btn => {
                        btn.addEventListener('click', (event) => {
                            const itemId = event.target.value;
                            const oldCreditAmount = document.querySelector(`.creditAmount[id="${itemId}"]`).innerHTML
                            var newCreditAmount = document.querySelector(`.creditAmountInput[id="${itemId}"]`).value
                            
                            if(btn.innerHTML=='Confirm'){
                               if(oldCreditAmount!=newCreditAmount){
                                    const name = document.querySelector(`.creditName[id='${itemId}']`).innerHTML
                                    
                                    const form_data = new FormData();
                                    form_data.append('reason','update')
                                    form_data.append('adminEmail',sessionStorage.userEmail);
                                    form_data.append('name',name);
                                    form_data.append('newAmount',newCreditAmount);
                                    form_data.append('id',itemId);
                                    form_data.append('chitType',chitType.value)
                                    form_data.append('oldAmount',oldCreditAmount);

                                    fetch('./src/php/index.php',{
                                        method:"POST",
                                        body:form_data
                                    })
                                    .then(function(response){
                                        return response.json()
                                    })
                                    .then(function(responseData){
                                        todayCredits(responseData)
                                    })



                               }
                               else{
                                document.querySelector('.creditAmountInputLabel').hidden = true
                                document.querySelector('.creditAmountLabel').hidden = false
                                btn.innerHTML = 'Update'
                               }
                            }
                            else if(btn.innerHTML == 'Update'){
                                btn.innerHTML = 'Confirm'
                                document.querySelector('.creditAmountInputLabel').hidden = false
                                document.querySelector('.creditAmountLabel').hidden = true
                            }
                        });
                });

            }

            // console.log(responseData)
        })






    }
    else if(dailyCredit.hidden == false){
        dailyCredit.hidden = true
        payTableField.hidden = false
    }
}
