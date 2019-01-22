/*
* This module is responsible for getting and storing all messages in the system
*/

/* 
* returns all messages of the database and the name of the sender
* output: array of messages
*/
function all() {
    let query = "SELECT m.id, m.sender, m.receiver, m.message, m.created_at, u.id, u.name " 
                + "FROM `messages` AS m LEFT JOIN `users` AS u " 
                + "ON (m.sender = u.id) ORDER BY m.created_at ASC"

    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if(err) reject(err)
            else {
                var messages = []

                result.forEach(msg => {
                    var msg = {
                        id: msg.id,
                        sender: msg.sender,
                        sender_name: msg.name,
                        receiver: msg.receiver,
                        message: msg.message,
                        time: msg.created_at
                    }
    
                    messages.push(msg)
                })
    
                resolve(messages)
            }
        })
    })
}

/* 
* returns all broadcast type messages of the database and the name of the sender
* output: array of messages
*/
function allBroadcast() {
    let query = "SELECT m.id, m.sender, m.receiver, m.message, m.created_at, u.id, u.name " 
                + "FROM `messages` AS m LEFT JOIN `users` AS u " 
                + "ON (m.sender = u.id) "
                + "WHERE m.receiver = 'broadcast' ORDER BY m.created_at ASC"

    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if(err) reject(err)
            else {
                var messages = []

                result.forEach(msg => {
                    var msg = {
                        id: msg.id,
                        sender: msg.sender,
                        sender_name: msg.name,
                        receiver: msg.receiver,
                        message: msg.message,
                        time: msg.created_at
                    }
    
                    messages.push(msg)
                })
    
                resolve(messages)
            }
        })
    })
}

/* 
* save the message along with the serder and receiver info
* output: error or success message
*/
function save(sender, receiver, message) {
    let query = "INSERT INTO `messages`(sender, receiver, message) VALUES ('" 
                + sender + "', '" + receiver + "', " + '"' + message + '"' + ")"

    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if(err) reject(err)
            else resolve(result)
        })
    })
}

module.exports = {
    all: all,
    allBroadcast, allBroadcast,
    save: save
}