  // Broadcast to everyone else, but not needed for now
  //wss.clients.forEach(function each(client) { if (client !== ws && client.readyState === WebSocket.OPEN) { client.send(data);}});

  //check if it's still possible to communicate to the user
  // if(ws.readyState === WebSocket.OPEN) {


   //req.connection.remoteAddress, req.url, even cookies and other request url data

   //HTTP Traffic Redirect to HTTPS //http.createServer(server).listen(80); //server.get('*', function(req, res) { res.redirect('https://' + req.headers.host + req.url); })
