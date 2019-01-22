/* 
* This module is for showing logs to the console from one place and one customization
*/

function info(text) {
    console.log(new Date(), text)
}

function error(error) {
    console.error(new Date(), error)
}

module.exports = {
    info: info,
    error, error
}