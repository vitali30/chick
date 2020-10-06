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