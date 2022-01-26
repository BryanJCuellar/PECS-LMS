module.exports = function (data) {
    let firstName = data.split(' ').slice(0, 1).join(' ');
    return firstName;
}