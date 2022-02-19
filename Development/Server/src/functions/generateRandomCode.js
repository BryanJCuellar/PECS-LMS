// Random Code for Confirmation Code
module.exports = function (length, type) {
    let characters;
    switch (type) {
        case 'num':
            characters = "0123456789";
            break;
        case 'alf':
            characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            break;
        case 'rand':
            // FOR ↓
            break;
        default:
            characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            break;
    }
    let code = "";
    for (i = 0; i < length; i++) {
        if (type == 'rand') {
            code += String.fromCharCode((Math.floor((Math.random() * 100)) % 94) + 33);
        } else {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    }
    return code;
}