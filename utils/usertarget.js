function parseUser(str, fallback) {
    if (!str) {
        return fallback;
    }
    if (str.startsWith('<@') && str.endsWith('>')) {
        str = str.substring(2, str.length - 1);
    }
    return str;
}
exports.parseUser = parseUser;