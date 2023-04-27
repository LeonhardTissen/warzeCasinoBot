function parseUser(str) {
    if (str.startsWith('<@') && str.endsWith('>')) {
        str = str.substring(2, str.length - 1);
    }
    return str;
}
exports.parseUser = parseUser;