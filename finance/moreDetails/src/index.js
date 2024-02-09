const getId = getSessionId()

fetchClientDetails(getId);

const backBtn = document.querySelector('.DetailsBackBtn')
backBtn.addEventListener('click',backBtnFunction)

fetchClientDetailsChitType()