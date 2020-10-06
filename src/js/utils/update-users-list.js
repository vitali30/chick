async function updateUsersList() {
    const $membrsList = document.querySelector('.feed__members_list');
    const $memberElement = document.querySelector('.feed__members_one');
    $membrsList.innerHTML = '';
    const allMembers = await userFetchs.getAllUsers();
    allMembers.forEach((el) => {
        const double = $memberElement.cloneNode(true)
        double.classList.remove('not_display');
        
        double.id = el.login;
        double.querySelector('.member_link').href = `#entered/members/${el.login}`;

        if(el.photo === ''){
            double.querySelector('.member_link').style.backgroundImage = `url(./img/noImage.jpg)`;
            
        }else{  
            double.querySelector('.member_link').style.backgroundImage = `url(http://localhost:5000/${el.photo})`;
        }

        double.querySelector('.member_name').innerText = `${el.firstName} ${el.lastName}`;
        double.querySelector('.member_status').innerText = el.status;
        $membrsList.appendChild(double)
    })

}