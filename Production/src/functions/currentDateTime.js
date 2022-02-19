// Current Date in MySQL Format
exports.getCurrentDate = function (datepart) {
    let result_date, date, day, month, year;
    date = new Date();
    day = ("0" + date.getDate()).slice(-2);
    month = ("0" + (date.getMonth() + 1)).slice(-2);
    year = date.getFullYear();
    switch (datepart) {
        case 'day':
            result_date = `${day}`;
            break;
        case 'month':
            result_date = `${month}`;
            break;
        case 'year':
            result_date = `${year}`;
            break;
        default:
            result_date = `${year}-${month}-${day}`;
            break;
    }
    return result_date;
};
// Current DateTime in MySQL Format
exports.getCurrentDateTime = function () {
    let current_datetime, date, day, month, year, hours, minutes, seconds;
    date = new Date();
    day = ("0" + date.getDate()).slice(-2);
    month = ("0" + (date.getMonth() + 1)).slice(-2);
    year = date.getFullYear();
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();

    current_datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return current_datetime;
};