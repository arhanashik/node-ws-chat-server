# Chat Land Server

## It's the server app using WebSocket and node.js

## Description
This app can be used as the websocket and http server for the chat-land web app

## Installation
- Download or clone the repo
- run `npm install`
- run `npm index.js` or `nodemon`
- the server will be running on port 1337

## How it works
- The app uses `websocket` for the socket server and `express` for http server
- there are several events uder the websocket
- `request` is the first step to create connection between the server and any client
- with `request` callback we get a new connection request, check it's origin, create an uniqe session id for the client and add it to our connections array and send a welcome message
- with `message` event we receive `utf8` message from the clients
- we accept only json data which must have to contain the users **sessionId** and **messageType** to ensure security
- with messageType **authenticate** the client send an email and password
- after successful authentication the used added to our online user array along with the session token and we send the previous message history to the client
- with messageType **broadcast** the client send a message along with the session id
- we validate the session and if it's valid we store the message to database and send to all
- with `close` event we check the remoteAddress and remove the dead connection from the connections array and the dead user from the online array

- the app also uses `express` to response to the http requests and works as an **api**
- there are total 4 api now
- 1. **signup**: user can signup using the api (/signup) by sending name, email and password in post method. Ofcourse we encrypt the password for security. the user will get the json response for error or success
- 2. **login**: user can login using the api (/login) by sending email and password. in return the user will get json response of the own info(as 'me'), online users (as 'users') and the previous chat history (as 'history', only the broadcast messages) or error
- 3. **status**: this api (/status) will return the total connection count and the online users list in json format
- 4. **message**: this api (/message) can be used to send a message to any specific user. the input data should be sender_id(own id), receiver_session_id and message. the output will be success or failure or more 'receiver is offline'!

- All codes are well formated and moduled
- **Promise** is used for the sync the operations
- **modules** folder contains the required modules for the app
- ***db*** module is for the database oparations
- ***helper*** module is for the helper methods like: password encryption, html data filter, show logs
- ***ws*** module is for all kind of websocket operations

- **routes** folder contains the routing part
- ***routes-http.js*** is for routing all the api calls 
- ***routes-ws.js*** is for all websocket connection events

If any confusion occers or have any query, feel free to contact me anytime at `ashik.pstu.cse@gmail.com`