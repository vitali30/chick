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