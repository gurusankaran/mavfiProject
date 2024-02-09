
if(sessionStorage.length==0){
    const indexPath = "/project"
    window.location.href = indexPath+'/finance/'
}

if(sessionStorage.oldAc=="false"){

const oldACLabel = document.querySelector('.oldACLabel');
oldACLabel.hidden = true

const settingsBackBtn = document.querySelector('.settingsBackBtn button')
const settingsClientShowBtn = document.querySelector('.settingsClientShowBtn');
const settingsClientShowLabel = document.querySelector('.settingsClientShowLabel');
const settingsClientHideLabel = document.querySelector('.settingsClientHideLabel');
const settingsClientHideBtn = document.querySelector('.settingsClientHideBtn')
const settingsClientBtn = document.querySelector('.settingsClientBtn')
const clientDataBody = document.querySelector('.clientDataBody');
const clientDataTable = document.querySelector('.ClientDataTable')


settingsBackBtn.addEventListener('click',()=>{
    window.history.back();
})

settingsClientShowBtn.addEventListener('click',()=>{
        settingsClientHideLabel.hidden = false
        settingsClientShowLabel.hidden = true
        const form_data = new FormData()
        form_data.append('reason','client')
        form_data.append('adminEmail',sessionStorage.userEmail)

        fetch('./src/php/index.php',{
            method:"POST",
            body:form_data
        })
        .then(function(response){
            return response.json()
        })
        .then(function(responseData){
            clientDataTable.hidden = false;

            if(responseData=='NoRecord'){
                return clientDataBody.innerHTML = '<center><td colspan=8>No Record Found</td></center>'
            }

            var temp = '';
            var serialNo = 1;

            // console.log(responseData)
            
            for (const item of responseData){
            temp += `
                <table>
                    <tr>
                        <td>${serialNo}</td>
                        <td class='settingsName' id='${item.id}'>${item.name}</td>
                        <td>${item.paidAmount}</td>
                        <td>${item.totalAmount}</td>
                        <td class='settingsChitType' id='${item.id}'>${item.chitType}</td>
                        <td>${item.interest}</td>
                        <td>${item.date}</td>
                        <td><button value='${item.id}' class="SettingsDetailsBtn">Details</button></td>
                    </tr>
                </table>
            `
            serialNo++;
            }
            clientDataBody.innerHTML = temp;
            const SettingsDetailsBtn = document.querySelector('.SettingsDetailsBtn');
            document.querySelectorAll('.SettingsDetailsBtn').forEach(button=>{
                button.addEventListener('click',(event)=>{
                    const itemId = event.target.value;

                    settingsName = document.querySelector(`.settingsName[id="${itemId}"]`).innerHTML
                    settingsChitType = document.querySelector(`.settingsChitType[id="${itemId}"]`).innerHTML
                    
                    sessionStorage.setItem('name',settingsName)
                    sessionStorage.setItem('id',itemId)
                    sessionStorage.setItem('chitType',settingsChitType)
                    window.location.href='../moreDetails/'

                    console.log(settingsChitType)
                })
            })

        })
    })

settingsClientHideBtn.addEventListener('click',()=>{
        settingsClientHideLabel.hidden = true
        settingsClientShowLabel.hidden = false
        clientDataTable.hidden = true
        
})


}
else if(sessionStorage.oldAc=="true"){
    const settingHeading = document.querySelector('.settingHeading')
    const settingsLabel = document.querySelector('.settingsLabel');
    settingHeading.textContent = 'Old Account'
    settingsLabel.hidden=true

    const backBtn = document.querySelector('.backBtn')
    backBtn.addEventListener('click',()=>{
        history.back();
    })
}
else{
    console.log(sessionStorage)
}