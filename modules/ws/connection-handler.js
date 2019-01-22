/* 
* This module is for handling the websocket connections
*/

// returns the connection for any session id or false
function getConnection (sessionId) {
    for(var i = 0; i < connections.length; i++) {
        if (connections[i].session_id === sessionId) return connections[i].connection
    }

    return false
}

//return the online user for any session or or false
function getUser(sessionId) {
    for(var i = 0; i < activeUsers.length; i++) {
        if (activeUsers[i].session_id === sessionId) return activeUsers[i].user
    }

    return false
}

//add new user to the online user list
function addUser(sessionId, user) {
    var activeUserObj = {
        session_id: sessionId,
        user: user
    }
    activeUsers.push(activeUserObj)
}


//add new connection to the recent connection list
function addConnection(sessionId, connection) {
    var connectionObj = {
        session_id: sessionId,
        connection: connection
    }
    connections.push(connectionObj)
}

//remove connections from the recent connections list
function removeConnection(remoteAddress) {
    var deadConnection = false
    var deadSessionId = false

    //check the connection exists using remoteAddress
    for(var i = 0; i < connections.length; i++) {
        if (connections[i].connection.remoteAddress === remoteAddress) {
            deadConnection = i
            deadSessionId = connections[i].session_id
            
            break
        }
    }

    //remove the connection if exists
    if(deadConnection !== false) {
        connections.splice(deadConnection, 1)
        deadConnection = false
    }

    //check the user with the session id
    for(var i = 0; i < activeUsers.length; i++) {
        if (activeUsers[i].session_id === deadSessionId) {
            deadConnection = i
            break
        }
    }

    //remove the user from the list as it's offline now
    if(deadConnection !== false) {
        activeUsers.splice(deadConnection, 1)
    }
}

module.exports = {
    getConnection: getConnection,
    getUser: getUser,
    addUser: addUser,
    addConnection: addConnection,
    removeConnection: removeConnection
}