const MIN_CHAR = 8;
const MAX_CHAR = 256
const SYMBOLS = '@$*#&+-=';

//Constant variables that will deal with the first option
const NUMBER_OF_CHARS = document.getElementById("inumber");
const INCLUDE_SYMBOLS = document.getElementById("ichar_opt");
const INCLUDE_NUMBERS = document.getElementById("inum_opt");
const INCLUDE_UPPER = document.getElementById("iupper_opt");
const INCLUDE_LOWER = document.getElementById("ilower_opt");
const COMBO_BOX = document.getElementById("iselection_of_char");
const SUBMIT_OPT1 = document.getElementById("i1submit");

//Constant variables that will deal with the second option.
const INPUT_TEXT = document.getElementById("ishuffleInput");
const SUBMIT_OPT2 = document.getElementById("i2submit");

//Response HTML objects
const RESPONSE_OPT1 = document.getElementById("passwordPlacement1");
const RESPONSE_OPT2 = document.getElementById("passwordPlacement2");
const ENTROPY1 = document.getElementById("Entropy1");
const ENTROPY2 = document.getElementById("Entropy2");

HTML_CODE = function(label_par, variable) {
    return `<p style = "text-align: center; font-size: 2em; padding: 0px; margin-bottom: 10px;">${label_par}</p>
        <div style = "margin: auto;width: 80%; height: 80px; background-color: white; margin-top: 20px; padding: 20px;
        border-color: black; border-style: solid; border-width: 4px; border-radius: 10px; margin-bottom: 10px;
        overflow: auto;"><p style = 'font-size: 0.8em; text-indent: 0px;text-align: left; margin: 0px; padding: 0px; font-family: "cascadia code semibold", monospace;
        font-size: 1em;'>${variable}</p></div>`
}

function selectRandom(inputString) {
    const strSize = inputString.length;
    const randomPosition = Math.floor(Math.random() * strSize);
    const randomChar = inputString.charAt(randomPosition);
    return randomChar
}

function isInside(element, arr) {
    len = arr.length;
    for (let i = 0; i < len; i++) {
        if (element === arr[i]) {
            return true;
        }
    }
    return false;
}

function shuffleString(inputString) {
    const arrHelp = [];
    const arrIndexes = [];
    const size = inputString.length;
    while (arrIndexes.length < size) {
        const selectedIndex = Math.floor(Math.random() * size);
        if (!isInside(selectedIndex, arrIndexes)) {
            arrIndexes.push(selectedIndex);
        }
    }
    for (let i = 0; i < size; i++) {
        arrHelp.push(inputString.charAt(arrIndexes[i]));
    }
    const shuffledStr = arrHelp.join("");
    return shuffledStr
}

function genPassword(size, required_char, symbols_signal = true, upper_signal = true, lower_signal = true, number_signal = true) {
    const arr_chars = [];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (symbols_signal) {
        arr_chars.push(SYMBOLS);
    }
    if (upper_signal) {
        arr_chars.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    }
    if (lower_signal) {
        arr_chars.push(letters.toLowerCase());
    }
    if (number_signal) {
        arr_chars.push('0123456789');
    }
    const arr_password = [];
    let position = 0;
    for (let i = 0; i < size; i++) {
        arr_password.push(selectRandom(arr_chars[position]))
        position++;
        if (position === arr_chars.length) {
            position = 0;
        }
    }
    arr_password[Math.floor(Math.random() * size)] = required_char;
    const nonChaoticPassword = arr_password.join("");
    const chaoticPassword = shuffleString(nonChaoticPassword);
    return chaoticPassword
}

function getEntropy(size, required_char, symbols_signal, upper_signal, lower_signal, number_signal) {
    
    //This function is built for the first scenario.
    //Let Range be the number of possible characters to be put inside the password, Length be the size of the Password, then E = log2(R^L) will be the entropy of the password.
    //Security is proportional to entropy.

    let range = 0;
    if (symbols_signal) {
        range += SYMBOLS.length;
    }
    if (upper_signal) {
        range += 26;
    }
    if (lower_signal) {
        range += 26;
    }
    if (number_signal) {
        range += 10;
    }
    const arr_char = [];
    for (let i = 0; i < SYMBOLS.length; i++) {
        arr_char.push(SYMBOLS[i]);
    }
    if (!isInside(required_char, arr_char)) {
        range++;
    }
    const ENTROPY = Math.log2(range ** size);
    return ENTROPY;
}

function getPasswordStrength(entropy) {

    if (entropy <= 28) {
        return "Very weak";
    } else if (entropy > 28 && entropy <= 35) {
        return "Weak";
    } else if (entropy > 36 && entropy <= 59) {
        return "Standard";
    } else if (entropy > 60 && entropy <= 79) {
        return "Strong";
    } else if (entropy > 79 && entropy <= 100) {
        return "Very Strong";
    } else if (entropy > 100) {
        return "Impossible to break";
    }

}

let REAL_SEC_PASSWORD;
let REAL_FIRST_PASSWORD;
const ALERT_MSG = "Generate the password or wait it to be processed if you've already created it.";

SUBMIT_OPT1.onclick = function() {
    //Getting the input values from the HTML widgets.
    const PASSWORD_SIZE = Number(NUMBER_OF_CHARS.value);
    const PERMISSION_SYMBOLS = INCLUDE_SYMBOLS.checked;
    const PERMISSION_UPPER = INCLUDE_UPPER.checked;
    const PERMISSION_NUMBERS = INCLUDE_NUMBERS.checked;
    const PERMISSION_LOWER = INCLUDE_LOWER.checked;
    const MUST_BE = COMBO_BOX.value;

    //Error mesages to be shown on screen
    const ERR_MSG1 = "You must fill at least one box";
    const ERR_MSG2 = `The number of elements in the password must be between ${MIN_CHAR} and ${MAX_CHAR}.`;

    const entropy = getEntropy(PASSWORD_SIZE, MUST_BE, PERMISSION_SYMBOLS, PERMISSION_UPPER, PERMISSION_LOWER, PERMISSION_NUMBERS);
    const STATUS = getPasswordStrength(entropy);

    //Operating with respect to conditions
    if (!PERMISSION_SYMBOLS && !PERMISSION_UPPER && !PERMISSION_NUMBERS && !PERMISSION_LOWER) {
        RESPONSE_OPT1.innerHTML = `<p style = "color: red; padding: 0px; text-align: center;"> ${ERR_MSG1} </p>`;
    } else if (PASSWORD_SIZE < MIN_CHAR || PASSWORD_SIZE > MAX_CHAR) {
        RESPONSE_OPT1.innerHTML = `<p style = "color: red; padding: 0px; text-align: center;"> ${ERR_MSG2} </p>`
    } else {
        for (let i = 0; i < 50; i++) {
            setTimeout(function() {
                let password = genPassword(PASSWORD_SIZE, MUST_BE, PERMISSION_SYMBOLS, PERMISSION_UPPER, PERMISSION_LOWER, PERMISSION_NUMBERS);
                let RESPONSE1_HTML = HTML_CODE("&#x1F512; Generating your password:", password);
                RESPONSE_OPT1.innerHTML = RESPONSE1_HTML;}, i**2);
        }
        setTimeout(function() {
            REAL_FIRST_PASSWORD = genPassword(PASSWORD_SIZE, MUST_BE, PERMISSION_SYMBOLS, PERMISSION_UPPER, PERMISSION_LOWER, PERMISSION_NUMBERS);
            let RESPONSE1_HTML = HTML_CODE("&#x1F513; Your password:",  REAL_FIRST_PASSWORD);
            RESPONSE_OPT1.innerHTML = RESPONSE1_HTML;
            ENTROPY1.innerText = `Status: ${STATUS}\nEntropy: ${entropy.toFixed(2)}`}, 50**2 + 1);
    }
}

SUBMIT_OPT2.onclick = function() {
    const INPUT = INPUT_TEXT.value;
    const ERR_MSG2 = `The number of elements inside the text must be between ${MIN_CHAR} and ${MAX_CHAR}.`;
    const size = INPUT.length;
    if (size < MIN_CHAR || size > MAX_CHAR) {
        RESPONSE_OPT2.innerHTML = "<p style = 'color: red; padding: 0px; text-align: center'>" + ERR_MSG2 + "</p>";
    }
    else {
        for (let i = 0; i < 50; i++) {
            setTimeout(function() {
                let MESSED_PASSWORD = shuffleString(INPUT);
                let RESPONSE2_HTML = HTML_CODE("&#x1F512; Generating your password:",  MESSED_PASSWORD);
                RESPONSE_OPT2.innerHTML = RESPONSE2_HTML; console.log(i)}, i**2);
        }
        setTimeout(function() {
            REAL_SEC_PASSWORD = shuffleString(INPUT);
            let RESPONSE2_HTML = HTML_CODE("&#x1F513; Your password:",  REAL_SEC_PASSWORD);
            RESPONSE_OPT2.innerHTML = RESPONSE2_HTML;
            const entropy = Math.log2(104 ** INPUT.length)
            ENTROPY2.innerText = `Status: ${getPasswordStrength(entropy)}\nEntropy: ${entropy.toFixed(2)}`}, 50**2 + 1);
    }
}

document.getElementById("clip1").onclick = function() {
    if (REAL_FIRST_PASSWORD !== undefined) {
        navigator.clipboard.writeText(REAL_FIRST_PASSWORD);
    } else {
        alert(ALERT_MSG);
    }
}

document.getElementById("clip2").onclick = function() {
    if (REAL_SEC_PASSWORD !== undefined) {
        navigator.clipboard.writeText(REAL_SEC_PASSWORD);
    } else {
        alert(ALERT_MSG);
    }
}