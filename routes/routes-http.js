/*
* This module is responsible for responding to the api calls via http
*/

//db helpers
var authenticator = require('../modules/db/authenticator')
var userDb = require('../modules/db/user')
var messageDb = require('../modules/db/message')

//log helper
var log = require('../modules/helper/log')

//websocket helper
var wsMessageHandler = require('../modules/ws/message-handler')
var connectionHandler = require('../modules/ws/connection-handler')

/*
* login api
* input: email, password
* output: error: {success: false, message: error}
*         success: {success: true, message: message, me: ownInfo, users: online users, history: chatHistory}
*/
function login(req, res) {
    var email = req.body.email
    var password = req.body.password

    if(!email || !password) res.end(JSON.stringify({success:false, message: 'invalid credentials'}))

    authenticator.authenticate(email, password).then((user) => {
        messageDb.allBroadcast().then(messages => {
            var resObj = {
                success: true,
                message: 'valid user',
                me: user,
                users: activeUsers,
                history: messages
            }
            res.end(JSON.stringify(resObj))
        })
    }, (err) => {
        res.end(JSON.stringify({success:false, message: err}))
    })
}

/*
* signup api
* input: name, email, password
* output: error: {success: false, message: error}
*         success: {success: true, message: message}
*/
function signup(req, res) {
    var name = req.body.name
    var email = req.body.email
    var password = req.body.password

    if(!name || !email || !password) {
        res.end(JSON.stringify({success:false, message: 'required field(s) missing'}))
    }

    userDb.addUser(name, email, password).then(result => {
        res.end(JSON.stringify({success:true, message: 'signup successful'}))
    }, error => {
        res.end(JSON.stringify({success:false, message: error}))
    })
}

/*
* sendMessage api for sending message to single client
* input: sender_id(ownId), receiver_session_id, message
* output: error: {success: false, message: error}
*         success: {success: true, message: message sent to 'receiver name'}
*/
function sendMessage(req, res) {
    var senderId = req.body.sender_id
    var recevierSessionId = req.body.receiver_session_id
    var message = req.body.message

    if(!senderId) {
        res.end(JSON.stringify({success: false, message: 'invalid request'}))
    }

    if(!recevierSessionId) {
        res.end(JSON.stringify({success: false, message: 'no target receiver'}))
    }

    if(!message) {
        res.end(JSON.stringify({success: false, message: 'can\'t send empty message'}))
    }

    userDb.getUser(senderId).then(user => {
        var connection = connectionHandler.getConnection(recevierSessionId)
        var receiver = connectionHandler.getUser(recevierSessionId)
    
        if(connection === false || receiver === false) {
            res.end(JSON.stringify({success: false, message: 'receiver is offline'}))
        }
    
        wsMessageHandler.sendMessage(connection, user, receiver, message, new Date())
        res.end(JSON.stringify({success: true, message: `message sent to ${receiver.name}`}))
    }, error => {
        log.error(error)
        res.end(JSON.stringify({success: false, message: error}))
    })
}

/*
* sendMessage api for sending message to single client
* input: none
* output: {total_connection: number of recent connetions, users: online users}
*/

function status(req, res) {
    res.end(JSON.stringify({total_connection: connections.length, users: activeUsers}))
}

module.exports = {
    login: login,
    signup: signup,
    sendMessage: sendMessage,
    status: status
}