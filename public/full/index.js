const comentFetchs = {

    async addComent(coment) {
      const data = new FormData();
      data.append("json", JSON.stringify(coment));
      const response = await fetch ('http://localhost:5000/coment/', {method: "POST", body: data});
      const res = await response.json();
      viewFeed();
      return res
   },
  
   async getAllComents() {
    let response = await fetch('http://localhost:5000/coment/');
    let feed = await response.json();
    return JSON.parse(feed)
   }
   
  }
const USER = '../asserts/images/user-example.png';
const NO_IMAGE = '../asserts/images/noImage.jpg';
const NO_LOGIN = 'Your Login is not match our requirement';
const NO_PASSWORD = 'Your password is not match our requirement';
const LOGIN_REG_EXP = new RegExp('@'); //^[a-zA-Z_0-9]*$
const PSW_REG_EXP = new RegExp('(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])');
const HIDENN_CLASS = 'hiden';
const NO_MATCH = 'Your passwords is no match';
const SUCH_USER = 'there is no such user yet';
const ALREADY = 'This email is already used';
const UNCORRECT_PSW = 'Wrong password';
const ROUTE_EXP = /([^\/]+)$/g;
const feedFetchs = {

  async addPost(post) {
    const data = new FormData();
    data.append("json", JSON.stringify(post));
    const response = await fetch ('http://localhost:5000/feed/', {method: "POST", body: data});
    const res = await response.json();
    viewFeed();
    return res
 },

 async getAllFeedPosts() {
  let response = await fetch('http://localhost:5000/feed/');
  let feed = await response.json();
  return JSON.parse(feed)
 },
   
 async deletePostById(id) {
  let response = await fetch(`http://localhost:5000/feed/${id}`, {method: "DELETE"});
  let user = await response.json();
  viewFeed();
  return user;
 },

 async changePostName(id, newName) {
  const data = new FormData();
  data.append("json", JSON.stringify(newName));
  let response = await fetch(`http://localhost:5000/feed/name/${id}`, {method: "PUT", body: data} );
  let res = await response.json();
  return res
 },

 async changePostBody(id, newBody) {
  const data = new FormData();
  data.append("json", JSON.stringify(newBody));
  let response = await fetch(`http://localhost:5000/feed/body/${id}`, {method: "PUT", body: data} );
  let res = await response.json();
  return res
 },
}
class FeedForm {
    constructor() {
        this.$buttonStart = document.querySelector('.feed_button');
        this.$form = document.querySelector('.feed__form');
        this.$buttonEnd = document.querySelector('.feed__form_close');

    }
    addListeners() {
        this.$buttonStart.onclick = () => this.open();
        this.$buttonEnd.onclick = () => this.closeForm();
        this.$form.addEventListener('submit', (event) => this.updateUser(event));
    }
    
    open() {
        this.$form.classList.remove('settings__anim_before');
        this.$form.classList.add('settings__anim_after');
        this.$buttonStart.classList.add('not_display');
        this.$form.reset()
    }

    closeForm() {
        this.$form.classList.remove('settings__anim_after');
        this.$form.classList.add('settings__anim_before');
        this.$buttonStart.classList.remove('not_display'); 
    }

    async updateUser(event) {
        event.preventDefault();
        const file = document.querySelector('#feed_img').files[0];
        let img;
        if (file) {
            const result = await userFetchs.sendUserPhoto(file);
            img = result.result;
        }else{
            img = '';
        }
        const userLogin = await userFetchs.getAuthLogin();
        const result = await userFetchs.getOneUsersByLogin(userLogin);
        const fullCurrentUser = result[0];
        console.log(fullCurrentUser);
        const name = document.querySelector('#feed_heading').value;
        const text = document.querySelector('#feed_text').value;
        const date = new Date()
        feedFetchs.addPost({login: fullCurrentUser.login, authorID: fullCurrentUser._id, img, name, text, date});
        this.$form.reset();
        this.closeForm();
    }
}
function addField(field, value) {
    field.innerHTML = value;
}

function checkUserLogin($nameForm) {
    const nameValue = $nameForm.querySelector('.login__name').value;
    const $nameOutput = $nameForm.querySelector('.login__name_text');
    addField($nameOutput, '');
    let loginCheckingResult = false;
    if(!LOGIN_REG_EXP.test(nameValue) || nameValue.length < 3 || nameValue.length > 25) {
        loginCheckingResult = { message: NO_LOGIN, field: $nameOutput };
    }
    return { failLogin: loginCheckingResult};
}

function checkUserPsw($passwordForm) {
    const passwordValue = $passwordForm.querySelector('.login__psw').value;
    const $passwordOutput = $passwordForm.querySelector('.login__psw_text');
    addField($passwordOutput, '');
    let passwordCheckingResult = false;
    if(!PSW_REG_EXP.test(passwordValue) || passwordValue.length < 6 || passwordValue.length > 30) {
        passwordCheckingResult = { message: NO_PASSWORD, field: $passwordOutput };
    }
    return {failPsw: passwordCheckingResult};
}

async function checkRegistredUser($nameForm, $passwordForm, isLogup) {//!!!!!!!!!!!!!!
    const nameValue = $nameForm.querySelector('.login__name').value;
    const $nameOutput = $nameForm.querySelector('.login__name_text');
    const passwordValue = $passwordForm.querySelector('.login__psw').value;
    let matchCheckingResult = false;
    const datadase = await userFetchs.getAllUsers()
    const result = await datadase.filter(el => el.login === nameValue)

    if (isLogup && result.length !== 0) {
        matchCheckingResult = { message: ALREADY, field: $nameOutput };
    }
    if (!isLogup) {
        if (result.length === 0) {
            matchCheckingResult = { message: SUCH_USER, field: $nameOutput };
        }else if (result[0].password !== passwordValue) {
            matchCheckingResult = { message: UNCORRECT_PSW, field: $nameOutput };
        }
    }
    return { failLocalStorage: matchCheckingResult};
}

function checkPswMatching($passwordFormOne, $passwordFormTwo) {
    const passwordValueOne = $passwordFormOne.querySelector('.login__psw').value;
    const passwordValueTwo = $passwordFormTwo.querySelector('.login__psw').value;
    const $passwordOutput = $passwordFormOne.querySelector('.login__psw_text');
    let matchPasswords = false;

    if (passwordValueOne !== passwordValueTwo) {
        matchPasswords = {message: NO_MATCH, field: $passwordOutput};
    }
    return { failMatchPsw: matchPasswords };
}

function checkResults(messages) {
    let result = true;
    for (let point in messages) {
        if (messages[point]) {
            addField(messages[point].field, messages[point].message)
            result = false;
            break;
        }
    }
    return result
}

const logIn = async () => {
    const $name = document.querySelector('.login__name');
    const $psw = document.querySelector('.login__psw');

    let result = Object.assign({}, checkUserLogin($name), 
        checkUserPsw($psw), 
        await checkRegistredUser($name, $psw));

    if(checkResults(result)) {
        const userName = $name.querySelector('.login__name').value;
        const userPsw = $psw.querySelector('.login__psw').value;
        result = {user: userName, psw: userPsw};
    }else{
        result = false;
    }

    return result;
}

 const logUp = async () =>  {
    const $name = document.querySelector('.logup__name');
    const $firstPsw = document.querySelector('.logup__psw_first');
    const $secondPsw = document.querySelector('.logup__psw_second');

    let result = Object.assign({}, checkUserLogin($name),
        checkPswMatching($firstPsw, $secondPsw), 
        checkUserPsw($firstPsw), 
        checkUserPsw($secondPsw), 
        await checkRegistredUser($name, $firstPsw, true));

    if (checkResults(result)) {
        const userName = $name.querySelector('.login__name').value;
        const userPsw = $firstPsw.querySelector('.login__psw').value;
        result = {user: userName, psw: userPsw};
    }else{
        result = false;
    }
    return result;
} 
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
const router = {
    $currentUserName: document.querySelector('.user__container_name'),
    $currentUserStatus: document.querySelector('.user__container_status'),
    $membrsList: document.querySelector('.feed__members_list'),
    $feed: document.querySelector('.feed'),
    $membersList: document.querySelector('.feed__members'),
    $mainContent: document.querySelector('.content__container'),
    $navigation: document.querySelector('.navigation'),
    $greetingContainer: document.querySelector('.greeting__container'),
    $userColumn: document.querySelector('.user_column'),

    rout: {
        '': () => {
            router.closeUser();
            router.$mainContent.classList.add('not_display');
            router.$navigation.classList.add('not_display');
            router.$greetingContainer.classList.remove('not_display');

        },
        '#entered': () => {
            router.hideUser();
            router.hideGreeting();
            router.closeFeed();
            router.hideOneUser();
            router.clearUserList();
        },
        '#entered/feed': async () => {
            router.hideUser();
            router.hideGreeting();
            router.hideOneUser();
            router.openFeed();
        },
        '#entered/members': (user) => {
            router.hideUser();
            router.hideGreeting();
            router.closeFeed();
            router.hideOneUser();
            updateUsersList();
            if(user) {
                updateUserData(user)
            };
            
        },
        '#settings_form': () => {},
    },

    hideOneUser() {
        this.$userColumn.classList.add('not_display');
    },

    clearUserList() {
        this.$membrsList.innerHTML = '';
    },

    openFeed() {
        this.$feed.classList.remove('not_display');
        this.$membersList.classList.add('not_display');
        viewFeed();
    },

    closeFeed() {
        this.$feed.classList.add('not_display');
        this.$membersList.classList.remove('not_display');
    },

 
    hideGreeting() {
        this.$mainContent.classList.remove('not_display');
        this.$navigation.classList.remove('not_display');
        this.$greetingContainer.classList.add('not_display');
    },

    async hideUser() {
        const login = await userFetchs.getAuthLogin();
        const user = await userFetchs.getOneUsersByLogin(login);
        document.querySelector('.header__user_name').innerText = `${user[0].firstName} ${user[0].lastName}`;
        document.querySelector('.header__user_name').title = `${user[0].firstName} ${user[0].lastName}`;
        document.querySelector('.header__user_link').href = `#members/${user[0].login}`;
        if(user[0].photo === '') {
            document.querySelector('.header__user_link').style.backgroundImage = `url(./img/noImage.jpg)`;
        }else{
            document.querySelector('.header__user_link').style.backgroundImage = `url(http://localhost:5000/${user[0].photo})`;
        }
    },

    closeUser() {
        document.querySelector('.header__user_name').innerText = '';
        document.querySelector('.header__user_link').href = '#';
        document.querySelector('.header__user_link').style.backgroundImage = `url(./img/noImage.jpg)`;
    },


    addListeners() {
        window.onhashchange = () => this.checkHash();
        document.addEventListener("DOMContentLoaded", () => this.checkHash());
    },

    checkHash() {
        if(LOGIN_REG_EXP.test(location.hash)) {
            this.rout['#entered/members'](location.hash.match(ROUTE_EXP)[0])
        }else{
            this.rout[location.hash]();
        }
    }
}
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
const userFetchs = {
    async sendUserPhoto(file) {
        const data = new FormData();
        data.append("file", file);
        let response = await fetch(`http://localhost:5000/user`, {method: "POST", body: data} );
        let res = await response.json();
        return res
    },

    async addOneUser(loginInfo, userInfo) {
        const newUser = {
            login: loginInfo.user,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            password: loginInfo.psw,
            status: userInfo.status,
            photo: '',
            priority: '',
            bday: '',
            gender: '',
            isAuth: false
        }
        const data = new FormData();
        data.append("json", JSON.stringify(newUser));
        let response = await fetch(`http://localhost:5000/auth`, {method: "POST", body: data} );
        let res = await response.json();
        return res
    },

    async userAuth(userId) {
        let response = await fetch(`http://localhost:5000/auth/in/${userId}`);
        let user = await response.json();
        return user;
    },

    async userEscape() {
        let response = await fetch(`http://localhost:5000/auth/esc`);
        let user = await response.json();
        return user;
    },

    async getAuthLogin() {
        let response = await fetch(`http://localhost:5000/auth/current`);
        let user = await response.json();
        const login = JSON.parse(user)[0].login;
        return login
    },

    async getAllUsers() {//GET
        let response = await fetch('http://localhost:5000/user/all');
        let users = await response.json();
        return JSON.parse(users)
    },

    async getOneUsersByLogin(login) {//GET
        let response = await fetch(`http://localhost:5000/user/one/${login}`);
        let user = await response.json();
        return JSON.parse(user);
    },

    async getOneUsersByID(id) {//GET
        let response = await fetch(`http://localhost:5000/user/oneId/${id}`);
        let user = await response.json();
        return JSON.parse(user);
    },

    async deleteUser(login) {//DELETE
        let response = await fetch(`http://localhost:5000/user/${login}`, {method: "DELETE"});
        let user = await response.json();
        return user;
    },

    async updateUser(login, newData) {// PUT
        const data = new FormData();
        data.append("json", JSON.stringify(newData));
        let response = await fetch(`http://localhost:5000/user/${login}`, {method: "PUT", body: data} );
        let res = await response.json();
        return res
    },

    async updateUserName(newLogin, newName) {// PATCH
        const names = newName.split(' ')
        const data = new FormData();
        data.append("json", JSON.stringify({login: newLogin, firstName: names[0], lastName: names[1]}));
        let response = await fetch(`http://localhost:5000/user/name`, {method: "PATCH", body: data} );
        let res = await response.json();
        return res
    },

    async updateUserStatus(login, status) {// PATCH
        const data = new FormData();
        data.append("json", JSON.stringify({ login, status }));
        let response = await fetch(`http://localhost:5000/user/status`, {method: "PATCH", body: data} );
        let res = await response.json();
        return res
    },
}
class UserSettings {
    constructor() {
        this.$form = document.querySelector('.settings__container');
        this.$buttonStart = document.querySelector('.settings_button');
        this.$buttonEnd = document.querySelector('.close_settings');
        this.$settingsContainer = document.querySelector('.settings_field');//!!
    }

    open() {
        this.$form.classList.remove('settings__anim_before');
        this.$form.classList.add('settings__anim_after');
        this.$buttonStart.classList.add('not_display');
        this.$form.reset()
    }

    closeForm() {
        this.$form.classList.remove('settings__anim_after');
        this.$form.classList.add('settings__anim_before');
        this.$buttonStart.classList.remove('not_display');
    }

    addListeners() {
        this.$buttonEnd.onclick = () => this.closeForm();
        this.$form.addEventListener('submit', (event) => this.updateUser(event));
    }

    async updateUser(event) {
        event.preventDefault();
        const file = document.querySelector('#photo').files[0];
        const authUser = await userFetchs.getAuthLogin();
        const userData = this.getData(authUser) //{ login: 'user', password: 'psw', firstName: 'firstName', lastName: 'lastName', gender: 'male', bdate: '12-07-1989', photo: 'http://dsdsdsd/sdds/sd/s', status: 'status', priority: 'false' }
        if(file) {
            const fileName = await userFetchs.sendUserPhoto(file);
            userData.photo = fileName.result
        }
        const result = await userFetchs.updateUser(authUser, userData);
        this.closeForm();
        updateUsersList();
        updateUserData(authUser);
    }

    getData(login) {
        const firstName = document.getElementById('name_first').value;
        const lastName = document.getElementById('name_last').value;
        const password = document.getElementById('psw').value;
        const status = document.getElementById('status').value;
        const photo = document.getElementById('photo').value;
        const priority =  document.getElementById('priority').checked;
        const gender =  document.querySelector("input[type='radio']:checked").value;
        const bday =  document.getElementById('bday').value
        return {login, firstName, lastName, password, status, photo, priority, bday, gender, isAuth: true};
    }
}
async function viewFeed() {
    const $postElement = document.querySelector('.feed__post');
    const $feedContainer = document.querySelector('.feed__container');
    const allFeedPosts = await feedFetchs.getAllFeedPosts();//[{login: "2@2", authorID: "5f...", authorFirstName: "2", authorLastName: "2", img: "file-...", name: "Hel....", text: "...", date: "..."}, {...}, {...}, {...}]
    const $hr = document.createElement('hr');
    $hr.classList.add('break_line');

    $feedContainer.innerHTML = '';

    const allComents = await comentFetchs.getAllComents();//[{_id: "...", postID: "...", authorID: "....", comentText: "..."}, {}, {}, {}, {}]

    allFeedPosts.forEach(async (el) => {
        const double =  $postElement.cloneNode(true)
        const doubleHr =  $hr.cloneNode(true)
        double.classList.remove('not_display');
        double.id = `${el._id}`;
        double.querySelector('.feed__post_name').innerText = el.name;
        double.querySelector('.feed__post_name').title = el.name;

        double.querySelector('.feed__post_user').href = `#members/${el.login}`;
        const user = await userFetchs.getOneUsersByLogin(el.login)
     
        double.querySelector('.feed__post_user').innerText = `${user[0].firstName}  ${user[0].lastName}`;
        double.querySelector('.feed__post_user').title = `${user[0].firstName}  ${user[0].lastName}`;
        
        double.querySelector('.feed__post_image').src = `http://localhost:5000/${el.img}`
        double.querySelector('.feed__post_description').innerText = el.text;

        double.querySelector('.feed__post_delete').classList.add(el.authorID)
        double.querySelector('.feed__post_edit').classList.add(el.authorID)
        double.querySelector('.feed__post_hide').classList.add(el.authorID)

        double.querySelector('.feed__post_delete').id = `${el._id}`;
        double.querySelector('.feed__post_edit').id = `${el._id}`;
        double.querySelector('.feed__post_hide').id = `${el._id}`;
        double.querySelector('.feed__post_coment').id = `${el._id}`;


        double.querySelector('.feed__post_delete').onclick = (e) => deleteFeedPost(e.target);
        double.querySelector('.feed__post_edit').onclick = (e) => editFeedPost(e.target, double);
        double.querySelector('.feed__post_hide').onclick = (e) => hideFeedPost(e.target, double);
        double.querySelector('.feed__post_coment').onclick = (e) => hideComentForm(e.target, double);

        double.querySelector('.feep__post_chat').innerHTML = '';

        const currentComents = allComents.filter(coment => coment.postID === el._id);
        currentComents.forEach(async (coment) => {
            const fullUser = await userFetchs.getOneUsersByID(coment.authorID);
            const $oneComentContainer = document.querySelector('.coment__container');
            const doubleComent = $oneComentContainer.cloneNode(true);
            doubleComent.classList.remove('not_display');
        
            doubleComent.querySelector('.coment__container_link').href = `#members/${fullUser[0].login}`;
            doubleComent.querySelector('.coment__container_link').style.backgroundImage = `url(http://localhost:5000/${fullUser[0].photo})`;
            doubleComent.querySelector('.coment__container_text').innerText = coment.comentText

            double.querySelector('.feep__post_chat').appendChild(doubleComent);
        })





        $feedContainer.appendChild(double);
        $feedContainer.appendChild(doubleHr);

    })    
};

async function editFeedPost(el, post) {
    const id = localStorage.getItem('auth');
    if(el.classList.contains(id)) {
        const $postName = post.querySelector('.feed__post_name');
        const $input = document.querySelector('#input_example');
        const doubleInput = $input.cloneNode(true);
        doubleInput.classList.remove('not_display');
        doubleInput.classList.add('feed_input');
        doubleInput.placeholder = $postName.innerText
        $postName.innerHTML = '';
        $postName.appendChild(doubleInput);
        doubleInput.oninput = (event) => {
            feedFetchs.changePostName(el.id, event.target.value)
        }

        const $postBody = post.querySelector('.feed__post_description');
        const $textarea = document.querySelector('#textarea_example');
        const doubleTextarea = $textarea.cloneNode(true);
        doubleTextarea.classList.remove('not_display');
        doubleTextarea.classList.add('feed_input');
        doubleTextarea.placeholder = $postBody.innerText;
        $postBody.innerHTML = '';
        $postBody.appendChild(doubleTextarea)
        doubleTextarea.oninput = (event) => {
            feedFetchs.changePostBody(el.id, event.target.value)
        }
        document.onclick = (event) => {
            if (!event.target.classList.contains('feed_input')) {
                location.reload()
            }
        }
    }
};

async function deleteFeedPost(el) {
    const id = localStorage.getItem('auth');
    if(el.classList.contains(id)) {
        await feedFetchs.deletePostById(el.id);
    }
};

async function hideFeedPost(el, post) {
    post.querySelector('.feed__post_description').classList.toggle('full_body')
    post.querySelector('.feed__post_name').classList.toggle('full_name')
    el.classList.toggle('full_button');
};

async function hideComentForm(element, post) {
    const input = post.querySelector('.feed__coment_testarea')
    const $comentContainer =  post.querySelector('.feed__coment_container')
    $comentContainer.classList.toggle('not_display');
    input.focus()

    document.onclick = (event) => {
        if (!event.target.classList.contains('feed__coment_testarea') && !event.target.classList.contains('feed__post_coment')) {
            $comentContainer.classList.add('not_display');
        }
    }

    post.querySelector('.feed__coment_form').onsubmit = (event) => {
        event.preventDefault();
        const comentText = input.value;
        const postID = element.id;
        const authorID = localStorage.getItem('auth')
        if(comentText !== '') {
            comentFetchs.addComent({ postID, authorID, comentText})
            $comentContainer.classList.add('not_display');
            input.value = '';
        }
        
        
    }
}
class Controller {
    constructor() {
        this.view = new View();
        this.model = new Model();
        this.$greetingContainer = document.querySelector('.greeting__container');
        this.$dialog = document.querySelector('.entering_dialog');
        this.$logInForm = document.querySelector('.login__container');
        this.$logUpForm = document.querySelector('.logup__container');
        this.$settingsForm = document.querySelector('.settings');       
        this.$logOutApp = document.querySelector('.navigation__menu_logout');

        this.$userSettingsButton = document.querySelector('.settings_button');
        
      
        this.settings = new UserSettings();
        this.settings.addListeners();

        this.feedForm = new FeedForm();  
        this.feedForm.addListeners();   
      
    }

    addListeners() {
        this.$greetingContainer.onclick = (event) => this.view.startDialog(event);
        this.$dialog.addEventListener('click', (event) => this.view.closeDialog(event));
        this.$dialog.addEventListener('click', (event) => this.view.toggleForm(event));
        this.$logOutApp.onclick = () => {
            this.view.switchApp();
            localStorage.removeItem('auth');
            userFetchs.userEscape();
        };
        this.$logInForm.addEventListener('submit', (event) => this.loginSubmit(event));
        this.$logUpForm.addEventListener('submit', (event) => this.logUpSubmit(event));
        
        document.addEventListener('click', (event) => this.toggleNameStatusInputs(event));
        document.addEventListener('click', (event) => this.deleteCurrentMember(event));

        this.$userSettingsButton.onclick = () => this.settings.open();
    }

   


    async loginSubmit(event) {                  
        event.preventDefault();
        const resultOfChecking = await logIn();//{user: "userName", psw: "userPsw"}
            if (resultOfChecking) {
                const enteringNowUser = await userFetchs.getOneUsersByLogin(resultOfChecking.user);
                localStorage.setItem('auth', enteringNowUser[0]._id);//5f745ce138d67b69e463a80e
                await userFetchs.userAuth(enteringNowUser[0]._id);
                this.enterApp(resultOfChecking);
            }
    }
    
    async logUpSubmit(event) {
        event.preventDefault();
        const resultOfChecking = await logUp();
        if (resultOfChecking) {
            this.view.switchSettingForm()
            this.$settingsForm.onsubmit = async (event) => {
                event.preventDefault();
                const resultSettings = this.model.collectInputs();
                this.view.switchSettingForm();
                this.view.switchLogForm();
                const result = await userFetchs.addOneUser(resultOfChecking, resultSettings) //5f745ce138d67b69e463a80e
                if(result) {
                    localStorage.setItem('auth', result);
                    await userFetchs.userAuth(result);
                    this.enterApp(resultOfChecking);
                }
                
            }
        }
    }

    async enterApp(result) {
        this.$dialog.close();
        this.view.switchApp();
        // localStorage.setItem('auth', result.user);//change localStorage setting!
        location.hash = `#entered/members/${result.user}`;
    }

    async toggleNameStatusInputs(event) {
        const localInputsNow = document.querySelectorAll('.member__input');
        if(localInputsNow.length > 0 && !event.target.classList.contains('member__input')) {
           
            location.reload()//?????????????????

        }else if (event.target.classList.contains('member_name') || event.target.classList.contains('member_status')) {
            const fetchLogin = await userFetchs.getAuthLogin();//1@1
            if(event.target.parentNode.id === fetchLogin) {
                this.view.showLocalInput(event.target);
            }
            
        }
    }

    async deleteCurrentMember(event) {
        if(event.target.classList.contains('member_delete')) {
            const result = await userFetchs.deleteUser(event.target.parentNode.id)
            console.log(result)
            if (result == 'user deleted') {
                location.hash = `#entered/members`
            }
        }
    }
}
class Model {
    constructor() { 
    }
    collectInputs() {
        const firstName = document.querySelector('#entering__name_first').value;
        const lastName = document.querySelector('#entering__name_last').value;
        const status = document.querySelector('.entering_status').value;
        return { firstName, lastName, status }
    }
}
class View {
    constructor() {
        this.$dialog = document.querySelector('.entering_dialog');
        this.$logInForm = document.querySelector('.login__container');
        this.$logUpForm = document.querySelector('.logup__container');
        this.$settingsForm = document.querySelector('.settings');
        this.$greetingContainer = document.querySelector('.greeting__container');
        this.$mainContent = document.querySelector('.content__container');
        this.$navigation = document.querySelector('.navigation');
        this.$inputExample = document.getElementById('input_example');
    }

    startDialog(event) {
        switch (event.target.id) {
            case 'greeting_logup': 
                this.switchLogForm();
            case 'greeting_login':
                this.$dialog.showModal();
                break;
        }
    };

    closeDialog(event) {
            switch (event.target.id) {
                case 'close__settings':
                    this.switchSettingForm();
                case 'close__logup':
                    this.switchLogForm();
                case 'close__login':
                    this.$dialog.close();
                    break;
            }
        
    };

    toggleForm(event) {
        switch(event.target.id) {
            case 'swith_to_logup':
            case 'swith_to_login':
                this.switchLogForm();
                break;
            case 'swith_setting_logup':
                this.switchSettingForm();
                break;
        }   
    }

    switchLogForm() {
        this.$logInForm.classList.toggle('animation_before');
        this.$logInForm.classList.toggle('animation_after');
        this.$logUpForm.classList.toggle('animation_after');
        this.$logUpForm.classList.toggle('animation_before');
    }
    
    switchSettingForm() {
        this.$logUpForm.classList.toggle('animation_before');
        this.$logUpForm.classList.toggle('animation_after');
        this.$settingsForm.classList.toggle('animation_after');
        this.$settingsForm.classList.toggle('animation_before');
    }

    switchApp() {
        this.$mainContent.classList.toggle('not_display');
        this.$greetingContainer.classList.toggle('not_display');
        this.$navigation.classList.toggle('not_display');
    }

    showLocalInput(element) {
        const double = this.$inputExample.cloneNode(true);
        double.classList.remove('not_display');
        double.classList.add('member__input');
        double.placeholder = element.innerHTML;
        element.innerHTML = '';
        element.appendChild(double);
        double.oninput = (event) => {
            if(element.classList.contains('member_name')) {
                userFetchs.updateUserName(element.parentNode.id, event.target.value);
            }else if (element.classList.contains('member_status')) {
                userFetchs.updateUserStatus(element.parentNode.id, event.target.value)
            }
        }
    }
}


const controller1 = new Controller();
controller1.addListeners();
router.addListeners();

   

  var socket = new WebSocket("ws://localhost:5001/");

  socket.onopen = function() {
    socket.send("Go");
  };
  
  socket.onmessage = function() {
    location.reload()
  };
  

  
socket.onclose = function(event) {
  if (event.wasClean) {
    
  } else {
    location.reload()
  }
 
};
