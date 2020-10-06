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