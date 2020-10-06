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