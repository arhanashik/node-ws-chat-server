/*
* This module is responsible for authentication of the clients
*/

//encryption helper
var encryptor = require('../helper/encryptor')

/*
* authentication function
* input: email, password
* output: error or success message
*/
function authenticate(email, password) {
    return new Promise(function(resolve, reject) {
        let query = "SELECT * FROM `users` WHERE email = '" + email 
                    + "' AND password = '" + encryptor.encrypt(password) + "'"

        db.query(query, (err, result) => {
            if (err) {
                reject(err)
            }

            if(result.length > 0) {
                var userObj = {
                    id: result[0]['id'],
                    name: result[0]['name'],
                    email: result[0]['email']
                }

                resolve(userObj)
            }

            reject('invalid credentials')
        })
    })
}

module.exports = {
    authenticate: authenticate
}