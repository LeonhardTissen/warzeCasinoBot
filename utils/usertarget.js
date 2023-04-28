function isNumeric(str) {
    const numericRegex = /^[0-9]+$/;
    return numericRegex.test(str);
}

function parseUser(str, fallback) {
    if (!str) {
        return fallback;
    }
    if (str.startsWith('<@') && str.endsWith('>')) {
        str = str.substring(2, str.length - 1);
    }
    if (!isNumeric(str)) {
        return false;
    }
    return str;
}
exports.parseUser = parseUser;