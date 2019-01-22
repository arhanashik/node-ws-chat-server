/*
* This module is responsible for getting and storing users in the system
*/

var encryptor = require('../helper/encryptor')

/* 
* returns users info by the userId
* output: user info object
*/
function getUser(id) {
    return new Promise(function(resolve, reject) {
        let query = "SELECT * FROM `users` WHERE id = '" + id + "'"

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
        });
    })
}

/* 
* add new users to the database
* input: name, email, password
* output: error or success message
* extra: encrypt the password before storing
*/
function addUser(name, email, password) {
    return new Promise(function(resolve, reject) {
        let query = "INSERT INTO `users`(name, email, password) VALUES ('" 
                + name + "', '" + email + "', '" + encryptor.encrypt(password) + "')"

        db.query(query, (err, result) => {
            if (err) reject(err)
            else resolve(result)
        });
    })
}

module.exports = {
    getUser: getUser,
    addUser: addUser
}