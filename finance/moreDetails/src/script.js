function getSessionId(){
    if(!sessionStorage.id){
        window.location.href='../'
    }
    return sessionStorage.id;
}

function backBtnFunction(){
    history.back()
}

function fetchClientDetails(){
    const form_data = new FormData();
    form_data.append('reason','clientData')
    form_data.append('id',sessionStorage.id)
    form_data.append('name',sessionStorage.name)
    form_data.append('adminEmail',sessionStorage.userEmail)
    
    fetch('./src/php/index.php',{
        method:"POST",
        body:form_data
    })
    .then(function(response){return response.json()})
    .then(function(responseData){
        var temp = `
            <tr>
            <td>1</td>
            <td>${responseData[0].name}</td>
            <td>${responseData[0].chitType}</td>
            <td>${responseData[0].date}</td>
            <td>${responseData[0].paidAmount}</td>
            <td>${responseData[0].totalAmount}</td>
            <td>${responseData[0].interest}</td>
            </tr>
        `
        document.querySelector('.moreDetailsBody').innerHTML = temp
        document.querySelector('.chitTypeHead').innerHTML = sessionStorage.chitType + ' Chit'
        // console.log(responseData)
    })
    .catch((err)=>console.log(err))
}

function fetchClientDetailsChitType(){
    const form_data = new FormData();
    form_data.append('reason','clientDataChitType')
    form_data.append('id',sessionStorage.id)
    form_data.append('name',sessionStorage.name)
    form_data.append('chitType',sessionStorage.chitType)
    form_data.append('adminEmail',sessionStorage.userEmail)

    fetch('./src/php/index.php',{
        method:"POST",
        body:form_data
    })
    .then((response)=>response.json())
    .then((responseData)=>{

        const fullDetailedChitType = document.querySelector('.fullDetailedChitType');
        if(responseData==='noData'){
            fullDetailedChitType.innerHTML=`<td colspan=4>No Data Available</td>`;
        }
        else{
            var serialNo = 1
            var temp = ''
            var totalAmount = 0

            for(let i in responseData){
                temp += `
                    <tr>
                        <td>${serialNo++}</td>
                        <td>${responseData[i].chitType}</td>
                        <td>${responseData[i].date}</td>
                        <td>${responseData[i].amount}</td>
                    </tr>
                `
                totalAmount += responseData[i].amount

            }
            fullDetailedChitType.innerHTML=temp + `<tr><td colspan=3>Total Amount</td><td>${totalAmount}</td></tr>`;

            // console.log(responseData)
    }
    })
    .catch((err)=>console.log(err))
}