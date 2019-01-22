/*
* This module is responsible for the db config and connection
*/
var mysql = require('mysql')

//db config
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_ws_chat_db'
})

//db connection
function connect() {
    return new Promise(function (resolve, reject) {
        db.connect((err) => {
            if(err) {
                reject(err)
            }
        
            resolve(db)
        })
    })
}

module.exports = {
    connect: connect
}