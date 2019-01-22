/*
* This module is responsible for responding to the websocket connection events
*/

//db and websocket helpers
var authenticator = require('../modules/db/authenticator')
var wsMessageHandler = require('../modules/ws/message-handler')
var connectionHandler = require('../modules/ws/connection-handler')
var uniqid = require('uniqid')

//log helper
var log = require('../modules/helper/log')

function onRequest(request) {
    log.info(`connection from ${request.origin}`)

    //check origin and create new connection
    var connection = request.accept(null, request.origin)
    var sessionId = uniqid()

    //save the session id and the connection 
    connectionHandler.addConnection(sessionId, connection)
    
    //send welcome message
    wsMessageHandler.sayWelcome(connection, sessionId)

    //handle message event
    connection.on('message', (message) => {

        if(message.type === 'utf8') {
            log.info(`new text message ${message.utf8Data}`)

            var json = JSON.parse(message.utf8Data)
            var sessionId = json.session_id

            //check the session validity
            if(!sessionId || connectionHandler.getConnection(sessionId) === false) {
                log.error(`session expired ${sessionId}`)
                wsMessageHandler.sendError(connection, 'session expired!')
                return
            }

            switch(json.type) {
                case 'authenticate': //authenticate request
                    var email = json.email
                    var password = json.password

                    if(!email || !password) wsMessageHandler.sendError(connection, 'invalid credentials')

                    //check authentication
                    authenticator.authenticate(email, password).then((user) => {
                        //add tp online user list
                        connectionHandler.addUser(sessionId, user)
                        //send previous history
                        wsMessageHandler.sendHistory(connection, user)
                    }, (err) => {
                        wsMessageHandler.sendError(connection, err)
                    })
                    break
                    
                case 'broadcast': //message brodcast request
                    log.info(`broadcast to ${connections.length} users`)
                    //check session
                    var sender = connectionHandler.getUser(sessionId)

                    if(sender !== false) {
                        //broadcast message
                        wsMessageHandler.sendToAll(connections, sender, json.message)
                    } else {
                        wsMessageHandler.sendError(connection, 'session expired')
                    }
                    
                    break

                default:
                    log.error(`Yet I don't know this type of message: ${json.type}`)
                    break
            }
        }
    })

    //handle connection close event
    connection.on('close', function(reasonCode, description) {
        log.error(`Peer ${connection.remoteAddress} disconnected`)
        log.error(`reasonCode: ${reasonCode}, reason: ${description}`)
        //remove connection and the related online user
        connectionHandler.removeConnection(connection.remoteAddress)
    })
}

module.exports = {
    onRequest: onRequest
}