let loginOption = document.getElementById('login-option');

loginOption.addEventListener('click',()=>{
    ()=>{
        localStorage.clear('lastSignin');
        localStorage.clear('badInput');
    }
})