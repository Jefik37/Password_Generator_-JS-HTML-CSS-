export function selectRandom(inputString) {
    const strSize = inputString.length;
    const randomPosition = Math.floor(Math.random() * strSize);
    const randomChar = inputString.charAt(randomPosition);
    return randomChar
}

export function isInside(element, arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        if (element === arr[i]) {
            return true;
        }
    }
    return false;
}

export function shuffleString(inputString) {
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