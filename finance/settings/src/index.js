if(sessionStorage.oldAc=="false"){

const loadingTable = `
<table class="settingsTable table">
    <tr>
        <td class="settingsField">Name:</td>
        <td class="settingsInput skeleton"></td>
    </tr>
    <tr>
        <td class="settingsField">Email:</td>
        <td class="settingsInput skeleton"></td>
    </tr>
    <tr>
        <td class="settingsField">Password:</td>
        <td class="settingsInput skeleton"></td>
    </tr>
    <tr>
        <td class="settingsField">Mobile:</td>
        <td class="settingsInput skeleton"></td>
    </tr>
    <tr>
        <td class="settingsField">Total Client:</td>
        <td class="settingsInput skeleton"></td>
    </tr>
    <tr>
        <td class="settingsBackBtn settingsBtn"><button>Back</button></td>
        <td class="settingsEditBtn settingsBtn"><button>Edit</button></td>
    </tr>
</table>
`;
const indexPath = "/project"
const adminEmail = sessionStorage.userEmail;
const adminPassword = sessionStorage.userPassword;

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
                settingFetchData(adminEmail,adminPassword)
            }
            else {
                console.log(contentValidateData)
            }
        })
        .catch(function(err){
            console.log(err)
        })
}

function settingFetchData(adminEmail,adminPassword){
    const form_data = new FormData();
    form_data.append('reason','settingsData')
    form_data.append('adminEmail',adminEmail)

    fetch('./src/php/index.php',{
        method:"POST",
        body: form_data
    })
    .then(function (response){
        return response.json()
    })
    .then(function (responseData){

        removeSkeletonAnimation();
        responseData.password = null
        const idNumber = responseData.id
        const mobile = String(responseData.mobile)
        document.querySelector('.settingsImg').src = "../userPic/"+responseData.photo
        document.querySelector('.settingsName').textContent = responseData.name
        document.querySelector('.settingsEmail').textContent = responseData.email
        document.querySelector('.settingsPassword').textContent = "***********"
        document.querySelector('.settingsMobile').textContent = "***** **"+mobile.slice(-3)
        document.querySelector('.settingsClient').textContent = responseData[0]['COUNT(*)']

        

        // console.log(idNumber)

    })
}


function removeSkeletonAnimation(){
    let i;
    for(i=0;i<6;i++){
    document.querySelector('.skeleton').classList.remove('skeleton')
    }
}

}

else if(sessionStorage.oldAc=='true'){
    const form_data = new FormData();
    form_data.append('reason','oldAccount');
    form_data.append('adminEmail',sessionStorage.userEmail)
    
    fetch('./src/php/index.php',{
        method:"POST",
        body:form_data
    })
    .then(function(response){
        return response.json();
    })
    .then(function(responseData){



        if(responseData[0].present=='true'){
            responseData.splice(0,1)
            console.log(responseData[0])
            var temp = ''
            var serialNo = 1
            for(const item of responseData){
                temp += `
                    <tr>
                        <td>${serialNo++}</td>
                        <td>${item.name}</td>
                        <td>${item.paidAmount}</td>
                        <td>${item.totalAmount}</td>
                        <td>${item.chitType}</td>
                        <td>${item.interest}</td>
                        <td>${item.date}</td>
                    </tr>
                `
            }
            const oldAcBody = document.querySelector('.oldAcBody')
            oldAcBody.innerHTML=temp;
        }


        else if(responseData=='NoRecord'){
            const oldAcTable = document.querySelector('.oldAcTable')
            const oldAcHead = document.querySelector('.oldAcHead')
            const oldAcBody = document.querySelector('.oldAcBody')

            oldAcBody.innerHTML = '<center>No record Found</center>'
            oldAcHead.hidden = true;

            // console.log("responseData")
        }
        // console.log(responseData)
    })
}