async function updateUserData(login) {
    const currentMembers = await userFetchs.getOneUsersByLogin(login);
    const fullUser = currentMembers[0];
    const $userColumn = document.querySelector('.user_column');
    const $currentUserName = document.querySelector('.user__container_name');
    const $currentUserStatus = document.querySelector('.user__container_status');
    const $userPhoto = document.querySelector('.user__container_photo');
    const $settingsButton = document.querySelector('.settings_button');
    
    $userColumn.classList.remove('not_display');
    const fetchUser = await userFetchs.getAuthLogin();
    const currentLogin = fullUser.login;
    $settingsButton.classList.remove('not_display') 
    if(currentLogin !== fetchUser) {
        $settingsButton.classList.add('not_display')
    }
    if (fullUser) {
        $currentUserName.innerHTML = `${fullUser.firstName} ${fullUser.lastName}`;
        $currentUserStatus.innerHTML = fullUser.status;
    }
    if(fullUser.photo === '') {
        $userPhoto.src = './img/noImage.jpg'
    }else{
        $userPhoto.src = `http://localhost:5000/${fullUser.photo}`
    }
}