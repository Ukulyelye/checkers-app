let rateForm = document.getElementById('rate-form');
let rateType = document.getElementById('rate-type');
let rateLevels = document.getElementById('rate-levels');
let rateInput = document.getElementById('rate-input');
let rateButton = document.getElementById('rate-button');

let rateId = document.getElementById('rate-id');

let isPlayed = localStorage.getItem('isPlayed');



//user feedback id
//make it ciphered to make it cool
function caesarCipher(str, shift, decrypt = false) {
    // Calculate the shift amount for decryption
    if (decrypt) {
        shift = (26 - shift) % 26;
    }
    
    return str
        .split('')
        .map(char => {
            if (char.match(/[a-z]/i)) {
                const code = char.charCodeAt(0);
                let shiftedCode;
                if (code >= 65 && code <= 90) {
                    shiftedCode = ((code - 65 + shift) % 26) + 65; // for uppercase letters
                } else if (code >= 97 && code <= 122) {
                    shiftedCode = ((code - 97 + shift) % 26) + 97; // for lowercase letters
                }
                return String.fromCharCode(shiftedCode);
            }
            return char;
        })
        .join('');
}




//Just tell time the rate id is made with this function

function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be displayed as 12

    // Add leading zero to single digit minutes
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    return hours + ':' + minutes + ' ' + meridiem;
}



rateId.value = `Basic random id${caesarCipher(localStorage.getItem('usermessage') || 'none')} time: ${getCurrentTime()}`;
alert('hey');








if (isPlayed == 'yes') {
    setTimeout(startRate,2000);
    isPlayed = localStorage.setItem('isPlayed', 'not');
} 


let ratingLevel = '';

function startRate() {
    rateForm.style.display = 'flex';
}

rateLevels.onclick = (e)=> {
    let type = e.target.getAttribute('data-rate');
    let color = '';
    let levels = rateLevels.querySelectorAll('.feedback-form .fa-star');
    if (e.target.id == 'rate-levels') {
        return
    }
    switch (type) {
        //good just get better color pallete
        case '1': ratingLevel = 'Poor'; color = '#F08080'; break;
        case '2': ratingLevel = 'Bad'; color = '#DC143C'; break;
        case '3': ratingLevel = 'Good'; color = '#7FFF00'; break;
        case '4': ratingLevel = 'Excelent!'; color = '#1E90FF' ; break;
        case '5': ratingLevel = 'Beatiful!'; color = '#FFD700' ; break;
    }

    for (let icon of levels) {
        icon.classList.replace('fa-solid', 'fa-regular');
    }

    for (let i = 0; i < type; i++) {
        levels[i].classList.replace('fa-regular', 'fa-solid');
    }
    
    rateType.style.color = color;
    rateType.innerText = `${ratingLevel}`;
}


function addLoading() {
    if (rateInput.innerText != '') {
        let loader = documennt.querySelector('.loading-screen');
        loader.style.display = 'grid';
        rateForm.style.display = 'none';
    }
}




//add tick after reload

function reload () {
    location.reload();
    localStorage.setItem('isPlayed', 'yes');
  }