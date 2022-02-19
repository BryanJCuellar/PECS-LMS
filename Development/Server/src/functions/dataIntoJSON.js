// MySQL Data into JSON
module.exports = function (data) {
    let string = JSON.stringify(data);
    let object = JSON.parse(string);
    return object;
}