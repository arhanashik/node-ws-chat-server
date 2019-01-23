/* 
* This module is for sending all kind of websocket messages from the system
*/

var messageDb = require('../db/message')
var htmlEntityFilter = require('../helper/html-entity')
var log = require('../helper/log')

//send welcome message and session id to the new client 
function sayWelcome(connection, sessionId) {
    var welcomeObj = {
        time: new Date(),
        session_id: sessionId,
        message: 'Welcome to chat-land',
        sender_name: 'chat-land',
        color: 'purple'
    }

    connection.sendUTF(
        JSON.stringify({type: 'welcome', data: welcomeObj})
    )
}

//save the message to the mysql db
function saveToDb(sender, receiver, message) {
    messageDb.save(sender, receiver, htmlEntityFilter.filter(message)).then(result => {
        log.info('messaged saved to db')
    }, (error) => {
        log.error(error)
    })
}

//send message to single client
function sendMessage(connection, sender, receiver, message, time) {
    saveToDb(sender.id, receiver.id, message)

    var msg = {
        time: time,
        message: htmlEntityFilter.filter(message),
        senderId: sender.id,
        sender_name: sender.name
    }

    connection.sendUTF(
        JSON.stringify({type: 'message', data: msg})
    )
}

//broadcast message to all online connections
function sendUTFToAll(sender, message) {
    saveToDb(sender.id, 'broadcast', message)

    var time = new Date()
    var msg = {
        time: time,
        message: htmlEntityFilter.filter(message),
        senderId: sender.id,
        sender_name: sender.name
    }

    for (var i = 0; i < connections.length; i++) {
        connections[i].connection.sendUTF(
            JSON.stringify({type: 'message', data: msg})
        )
    }
}

//broadcast connection to all online connections
function sendConnectionToAll(connection, status) {

    var time = new Date()
    var data = {
        time: time,
        connection: connection,
        status: status
    }

    for (var i = 0; i < connections.length; i++) {
        connections[i].connection.sendUTF(
            JSON.stringify({type: 'connection', data: data})
        )
    }
}

//send the chat history and online users list to the client
function sendHistory(connection, user) {
    messageDb.allBroadcast().then(result => {
        connection.sendUTF(
            JSON.stringify({type: 'history', user: user, online_users: activeUsers, data: result})
        )
    }, (error) => {
        sendError(connection, error)
    }) 
}

//send error message to the client
function sendError(connection, error) {
    connection.sendUTF(
        JSON.stringify({type: 'error', error: error})
    )
}

module.exports = {
    sayWelcome: sayWelcome,
    sendMessage: sendMessage,
    sendUTFToAll: sendUTFToAll,
    sendConnectionToAll: sendConnectionToAll,
    sendHistory: sendHistory,
    sendError: sendError
}