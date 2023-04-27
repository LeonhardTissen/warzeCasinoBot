const valid_nums = "123456789";

function getNums(str) {
    const nums = [];

    for (let i = 0; i < str.length; i ++) {
        const char = str[i];

        if (valid_nums.includes(char)) {
            nums.push(parseInt(char));
        } else {
            return [];
        }
    }

    return nums;
}
exports.getNums = getNums;