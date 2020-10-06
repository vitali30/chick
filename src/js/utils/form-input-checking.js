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