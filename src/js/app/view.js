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