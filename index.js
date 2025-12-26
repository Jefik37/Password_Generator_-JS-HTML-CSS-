import {genPassword, getEntropy, getPasswordStrength} from '/features/password.js';
import {shuffleString} from '/features/utils.js';
//constant values that will be used along the code.
const MIN_CHAR = 8;
const MAX_CHAR = 256
const DATASET_PW = []; //As array in memory, it is constant, but the inner part of the array will change along the code.

let REAL_SEC_PASSWORD; //Variable that will store the password at option2 as string.
let REAL_FIRST_PASSWORD; //Variable that will store the password at option1 as string.

const Interaction = {
    NUMBER_OF_CHARS : document.getElementById("inumber"),
    INCLUDE_SYMBOLS : document.getElementById("ichar_opt"),
    INCLUDE_NUMBERS : document.getElementById("inum_opt"),
    INCLUDE_UPPER : document.getElementById("iupper_opt"),
    INCLUDE_LOWER : document.getElementById("ilower_opt"),
    COMBO_BOX : document.getElementById("iselection_of_char"),
    SUBMIT_OPT1 : document.getElementById("i1submit"),
    GET_PASSWORDS : document.getElementById("dataset_but"),
    INPUT_TEXT : document.getElementById("ishuffleInput"),
    SUBMIT_OPT2 : document.getElementById("i2submit"),
    RESPONSE_OPT1 : document.getElementById("passwordPlacement1"),
    RESPONSE_OPT2 : document.getElementById("passwordPlacement2"),
    ENTROPY1 : document.getElementById("Entropy1"),
    ENTROPY2 : document.getElementById("Entropy2"),
    DATASET : document.getElementById("idataset")
}

const HTML_PW = (label_par, variable) => {
    return `<p class = "JS_pw_label">${label_par}</p>
            <div class = "JS_password_area">
                <p>${variable}</p>
            </div>`
}
const EMBEDED_CSS = 'padding: 5px;border-width: 2px;border-color: black;border-style: solid;'; //Will be used for cells in tables.
const BASIC_TABLE_CSS = 'margin: auto; width: 80%; border-collapse: collapse; border-color: black; border-width: 2px; border-style: solid;';
const HTML_TABLE1 = (CSStable, CSStitle) => {
    return `<table style = "${CSStable}">
                <thead>
                    <tr>
                        <th style = "${CSStitle}">Id</th>
                        <th style = "${CSStitle}">Password</th>
                        <th style = "${CSStitle}">Length</th>
                        <th style = "${CSStitle}">Entropy</th>
                        <th style = "${CSStitle}">Status</th>
                    </tr>
                </thead>`
}

const HTML_TABLE2 = (signal, data1, data2, data3, data4, data5, CSS = EMBEDED_CSS) => {
    const C1TABLE = "#007f86;";
    const C2TABLE = "#c1f7ff;";
    return `<tr style = "background-color: ${(signal ? C1TABLE : C2TABLE)}; color: ${(signal ? "white;" : "black;")};">
                <td style = "${CSS}">${data1}</td>
                <td style = "${CSS}">${data2}</td>
                <td style = "${CSS}">${data3}</td>
                <td style = "${CSS}">${data4.toFixed(2)}</td>
                <td style = "${CSS}">${data5}</td>
            </tr>`
}

let watch_table = false; //true when we can see the table, false otherwise.
const ALERT_MSG = "Generate the password or wait it to be processed if you've already created it.";

Interaction.SUBMIT_OPT1.onclick = function() {
    //Getting the input values from the HTML widgets.
    const PASSWORD_SIZE = Number(Interaction.NUMBER_OF_CHARS.value);
    if (isNaN(PASSWORD_SIZE)) {
        throw new Error('THE SIZE OF THE PASSWORD MUST BE A NUMBER');
    }
    const PERMISSION_SYMBOLS = Interaction.INCLUDE_SYMBOLS.checked;
    const PERMISSION_UPPER = Interaction.INCLUDE_UPPER.checked;
    const PERMISSION_NUMBERS = Interaction.INCLUDE_NUMBERS.checked;
    const PERMISSION_LOWER = Interaction.INCLUDE_LOWER.checked;
    const MUST_BE = Interaction.COMBO_BOX.value;
    let HTML_STR;

    //Error mesages to be shown on screen
    const ERR_MSG1 = "You must fill at least one box";
    const ERR_MSG2 = `The number of elements in the password must be between ${MIN_CHAR} and ${MAX_CHAR}.`;

    const entropy = getEntropy(PASSWORD_SIZE, MUST_BE, PERMISSION_SYMBOLS, PERMISSION_UPPER, PERMISSION_LOWER, PERMISSION_NUMBERS);
    const STATUS = getPasswordStrength(entropy);

    //Operating with respect to conditions
    if (!PERMISSION_SYMBOLS && !PERMISSION_UPPER && !PERMISSION_NUMBERS && !PERMISSION_LOWER) {
        Interaction.RESPONSE_OPT1.innerHTML = `<p class = "JS_ERR"> ${ERR_MSG1} </p>`;
    } else if (PASSWORD_SIZE < MIN_CHAR || PASSWORD_SIZE > MAX_CHAR) {
        Interaction.RESPONSE_OPT1.innerHTML = `<p class = "JS_ERR"> ${ERR_MSG2} </p>`
    } else {
        for (let i = 0; i < 50; i++) {
            setTimeout(function() {
                let password = genPassword(PASSWORD_SIZE, MUST_BE, PERMISSION_SYMBOLS, PERMISSION_UPPER, PERMISSION_LOWER, PERMISSION_NUMBERS);
                let RESPONSE1_HTML = HTML_PW("&#x1F512; Generating your password:", password);
                Interaction.RESPONSE_OPT1.innerHTML = RESPONSE1_HTML;}, i**2);
        }
        setTimeout(function() {
            let marker = true;
            REAL_FIRST_PASSWORD = genPassword(PASSWORD_SIZE, MUST_BE, PERMISSION_SYMBOLS, PERMISSION_UPPER, PERMISSION_LOWER, PERMISSION_NUMBERS);
            let RESPONSE1_HTML = HTML_PW("&#x1F513; Your password:",  REAL_FIRST_PASSWORD);
            Interaction.RESPONSE_OPT1.innerHTML = RESPONSE1_HTML;
            Interaction.ENTROPY1.innerText = `Status: ${STATUS}\nEntropy: ${entropy.toFixed(2)}`;
            DATASET_PW.push([DATASET_PW.length + 1, REAL_FIRST_PASSWORD, REAL_FIRST_PASSWORD.length, entropy, STATUS]);
            if (watch_table) {
                HTML_STR = HTML_TABLE1(BASIC_TABLE_CSS, EMBEDED_CSS);
                HTML_STR += '<tbody>';
                for (let i = 0; i < DATASET_PW.length; i++) {
                    HTML_STR += HTML_TABLE2(marker, ...DATASET_PW[i]);
                    marker = !marker;
                }
                HTML_STR += '</tbody>';
                HTML_STR += "</table>";
                Interaction.DATASET.innerHTML = HTML_STR;
            }
        }, 50**2 + 1);
    }
}

Interaction.SUBMIT_OPT2.onclick = function() {
    let HTML_STR;
    const INPUT = Interaction.INPUT_TEXT.value;
    const ERR_MSG2 = `The number of elements inside the text must be between ${MIN_CHAR} and ${MAX_CHAR}.`;
    const size = INPUT.length;
    if (size < MIN_CHAR || size > MAX_CHAR) {
        Interaction.RESPONSE_OPT2.innerHTML = "<p class = 'JS_ERR'>" + ERR_MSG2 + "</p>";
    }
    else {
        for (let i = 0; i < 50; i++) {
            setTimeout(function() {
                let MESSED_PASSWORD = shuffleString(INPUT);
                let RESPONSE2_HTML = HTML_PW("&#x1F512; Generating your password:",  MESSED_PASSWORD);
                Interaction.RESPONSE_OPT2.innerHTML = RESPONSE2_HTML;
            }, i**2);
        }
        setTimeout(function() {
            let marker = true;
            REAL_SEC_PASSWORD = shuffleString(INPUT);
            let RESPONSE2_HTML = HTML_PW("&#x1F513; Your password:",  REAL_SEC_PASSWORD);
            Interaction.RESPONSE_OPT2.innerHTML = RESPONSE2_HTML;
            const entropy = Math.log2(104 ** INPUT.length);
            const status = getPasswordStrength(entropy);
            Interaction.ENTROPY2.innerText = `Status: ${status}\nEntropy: ${entropy.toFixed(2)}`;
            DATASET_PW.push([DATASET_PW.length + 1, REAL_SEC_PASSWORD, REAL_SEC_PASSWORD.length, entropy, status]);
            if (watch_table) {
            HTML_STR = HTML_TABLE1(BASIC_TABLE_CSS, EMBEDED_CSS);
            for (let i = 0; i < DATASET_PW.length; i++) {
                HTML_STR += HTML_TABLE2(marker, ...DATASET_PW[i]);
                marker = !marker;
                }
            HTML_STR += '</tbody>';
            HTML_STR += "</table>";
            Interaction.DATASET.innerHTML = HTML_STR;
            }
        }, 50**2 + 1);
    }
}

const ALERT_CODE = PASSWORD => {
    if (PASSWORD !== undefined) {
        navigator.clipboard.writeText(PASSWORD);
    } else {
        alert(ALERT_MSG);
    }
}

document.getElementById("clip1").onclick = function() {
    ALERT_CODE(REAL_FIRST_PASSWORD);
}

document.getElementById("clip2").onclick = function() {
    ALERT_CODE(REAL_SEC_PASSWORD);
}


Interaction.GET_PASSWORDS.onclick = function() {
    let marker = true;
    let HTML_STR;
    if (DATASET_PW.length === 0 ) {
        document.getElementById("NoAv").innerText = `No available data`;
    } else {
        watch_table = true;
        document.getElementById("NoAv").innerText = ``;
        HTML_STR = HTML_TABLE1(BASIC_TABLE_CSS, EMBEDED_CSS);
        HTML_STR += '<tbody>';
        for (let i = 0; i < DATASET_PW.length; i++) {
            HTML_STR += HTML_TABLE2(marker, ...DATASET_PW[i]);
            marker = !marker;
        }
        HTML_STR += '</tbody>';
        HTML_STR += "</table>";
        Interaction.DATASET.innerHTML = HTML_STR;
    }
}