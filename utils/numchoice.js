// Check if a given string is numeric
function isNumeric(str) {
    const numericRegex = /^[0-9]+$/;
    return numericRegex.test(str);
}
exports.isNumeric = isNumeric;

// Grab all numbers from a str and seperate them into an array.
function getNums(str) {
    if (!isNumeric(str)) {
        return [];
    }
    
    const nums = [];
    for (let i = 0; i < str.length; i ++) {
        const char = str[i];

        nums.push(parseInt(char));
    }

    return nums;
}
exports.getNums = getNums;