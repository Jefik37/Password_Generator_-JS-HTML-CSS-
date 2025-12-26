import {isInside, selectRandom, shuffleString} from './utils.js';

const SYMBOLS = '@$*#&+-='; //Symbols to be chosen.

export function genPassword(size, required_char, symbols_signal = true, upper_signal = true, lower_signal = true, number_signal = true) {
    const arr_chars = [];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    try {
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
    } catch (err) {
        console.log('SOMETHING WENT WRONG DURING THE CREATION OF THE PASSWORD');
        console.error(err);
    }
}

export function getEntropy(size, required_char, symbols_signal, upper_signal, lower_signal, number_signal) {
    
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

export function getPasswordStrength(entropy) {

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