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