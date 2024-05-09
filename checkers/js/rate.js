let rateForm = document.getElementById('rate-form');
let rateType = document.getElementById('rate-type');
let rateLevels = document.getElementById('rate-levels');
let rateInput = document.getElementById('rate-input');
let rateButton = document.getElementById('rate-button');

let starValue = 'default';

let isPlayed = localStorage.getItem('isPlayed');



//user feedback id
//make it ciphered to make it cool (I dont need now)
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












rateForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Get form data
    var formData = new FormData(this);
    
    // Send form data asynchronously
    fetch(this.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        // Optionally, do something with the successful response
        console.log("Form submitted successfully");
        // Redirect to github.com
        //window.location.href = "https://www.github.com";
        rateForm.style.display = 'none';
      } else {
        // Handle errors
        console.error("Form submission failed");
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
  });





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
        case '1': ratingLevel = 'Poor'; color = '#F08080'; starValue.value = '1 Poor'; break;
        case '2': ratingLevel = 'Bad'; color = '#DC143C'; starValue.value = '2 Bad'; break;
        case '3': ratingLevel = 'Good'; color = '#7FFF00'; starValue.value = '3 Good'; break;
        case '4': ratingLevel = 'Excelent!'; color = '#1E90FF'; starValue.value = '4 Excellent!'; break;
        case '5': ratingLevel = 'Beatiful!'; color = '#FFD700'; starValue.value = '5 Beatiful!'; break;
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