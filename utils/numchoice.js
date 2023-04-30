// Check if a given string is numeric
function isNumeric(str) {
    const numericRegex = /^[0-9]+$/;
    return numericRegex.test(str);
}
exports.isNumeric = isNumeric;

// Grab all numbers from a str and seperate them into an array.
function getNums(str) {
    // Split string into array with characters
    const arr = str.split('')
    
    // Change all strings into an integer
    const nums = arr.map((s) => parseInt(s))

    // Remove all entries from the array that are not integers
    const filtered_nums = nums.filter((s) => !isNaN(s))

    return filtered_nums;
}
exports.getNums = getNums;