function pluralS(i) {
    return i == 1 ? '' : 's';
}

function secToReadable(seconds) {
    const day = Math.floor(seconds / 86400);
    const hrs = Math.floor((seconds % 86400) / 3600);
    const min = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;

    let final_string = '';
    if (day > 0) {
        final_string += day + ` day${pluralS(day)}, `;
    }
    if (hrs > 0) {
        final_string += hrs + ` hour${pluralS(hrs)}, `;
    }
    if (min > 0) {
        final_string += min + ` minute${pluralS(min)}, `;
    }
    if (final_string != '') {
        final_string.substring(0, final_string.length - 1);
        final_string += 'and ';
    }
    final_string += sec + ` second${pluralS(sec)}`;

    return final_string;
}
exports.secToReadable = secToReadable;