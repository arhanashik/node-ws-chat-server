//http and websocket imports
var express = require('express')
var http = require('http')
var websocket = require('websocket')
var bodyParser = require('body-parser')

// helper
var log = require('./modules/helper/log')

//database connector
var dbConnector = require('./modules/db/connector')

//http and websocket routes
var routeHttp = require('./routes/routes-http')
var routeWS = require('./routes/routes-ws')

//global array for the current connections and online users
global.connections = []
global.activeUsers = []

//initializing the http and websocket servers
const app = express()
const server = http.createServer(app)
const wsServer = new websocket.server({ httpServer: server })

//listent to websocket requests
wsServer.on('request', routeWS.onRequest)


//listen to the api calls
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/status', routeHttp.status)
app.post('/message', routeHttp.sendMessage)
app.post('/signup', routeHttp.signup)
app.post('/login', routeHttp.login)


//start the server
server.listen(1337, () => {
    log.info(`server is running on port ${server.address().port}`)

    dbConnector.connect().then(function(result) {
        global.db = result
        log.info('connected to database')
    }, function(err) {
        log.error('database connection failed')
    })
})

