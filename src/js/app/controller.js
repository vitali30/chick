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