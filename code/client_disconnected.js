
//when client is disconnected, what happens component

function when_client_disconnects(ws, log) {
    //we can flick a switch telling which device is offline in this script
    ws.on('close', function(e) {
        delete ws.userID
        log('Websocket User Disconnected (' + e  + ')', 31)
     })
}

module.exports = when_client_disconnects;