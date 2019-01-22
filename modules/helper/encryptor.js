/* 
* This module is for providing encryption support
*/

const md5 = require('md5')

function encrypt (value) {
    return md5(value)
}

module.exports = {
    encrypt: encrypt
}