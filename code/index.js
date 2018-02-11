class User {
  constructor(id, ws) {
    this.id = id;
    this.online = true;
    this.ws = ws;
  }
}

var express = require('express')(),
    https = require('https'), //var http = require('http');
    fs = require('fs'),
    WebSocket = require('ws'),
    users = []
    //request = require('request')    

//HTTP Traffic Redirect to HTTPS //http.createServer(server).listen(80); //server.get('*', function(req, res) { res.redirect('https://' + req.headers.host + req.url); })
var ssl = {
  key: fs.readFileSync('/etc/letsencrypt/live/ie.dyndns.biz/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/ie.dyndns.biz/cert.pem')
}

//HTTPS
var server = https.createServer(ssl, express)
    server.listen(443)
//WSS
var wss = new WebSocket.Server({server:server});
    wss.on('connection', function connection(ws, req) { //req.connection.remoteAddress, req.url, even cookies and other request url data
      //ws is an active connection, but not a user in our case
      //so instead check in message for the token we give to our users,
      // verify it being in the user's list we create!

      //client sending a message, remember to look for an user then
      //answer the client query as a user.
      ws.on('message', function incoming(message) {
        //console.log('received: %s', message);
        console.log(JSON.stringify(message))
      });

      //we are going to send each user a very unique token key,
      //it will make each connection not so unique but user unique!
      //so even if ws changes the user can stay unique :)
      ws.send('something'); //new User('id' + i + time()) //unique enough? do sha256 of that
    });

 // Broadcast to everyone else, but not needed for now
 //wss.clients.forEach(function each(client) { if (client !== ws && client.readyState === WebSocket.OPEN) { client.send(data);}});



//Routes
express.get('/', function (req, res) { //if already logged in, perhaps this will be the main page
  res.sendFile(__dirname + '/public/login.html') //res.send("Hello World!");
});

function request_github(token) {

}
express.get('/login', function (req, res) { 
  //if('code' in req.query) {
    //GET https://github.com/login/oauth/access_token?client_id=6fcc7f9d452f050f57ad&redirect_uri=https://ie.dyndns.tv/login&client_secret=4a45d99b9bf1ebe92fa46b2e512129d574a82a9e&code=' + req.query.code,
    //POST https://github.com/api/v2/json/user/show?' + body  //  res.redirect('https://github.com/api/v2/json/user/show?access_token=' + req.query.access_token)  
  //}
    res.sendFile(__dirname + '/public/main.html')

});

express.post('/login', function(req, res) {
  //console.log(req)
  //if('google_login' in res.query) {
  //  console.log(res.query.google_login)
    res.sendFile(__dirname + '/public/main.html');
    //return;
})

express.get('/main', function (req, res) { res.sendFile(__dirname + '/public/main.html') });
express.get('/personal', function (req, res) { res.sendFile(__dirname + '/public/personal.html') });
express.get('/resister', function (req, res) { res.sendFile(__dirname + '/public/register.html') });
express.get('/settings', function (req, res) { res.sendFile(__dirname + '/public/settings.html') });

express.get('/js/client.js', function (req, res) { res.sendFile(__dirname + '/public/js/client.js') });
express.get('/js/materialize.min.js', function (req, res) { res.sendFile(__dirname + '/public/js/materialize.min.js') });

express.get('/css/style.css', function (req, res) { res.sendFile(__dirname + '/public/css/style.css') });
express.get('/css/materialize.min.css', function (req, res) { res.sendFile(__dirname + '/public/css/materialize.min.css') });

express.get('/images/Cubik.png', function (req, res) { res.sendFile(__dirname + '/public/images/Cubik.png') });
express.get('/images/male.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/male.jpg') });
express.get('/images/mom.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/mom.jpg') });
express.get('/images/femaleblonde.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/femaleblonde.jpg') });
express.get('/images/asian.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/asian.jpg') });

express.get('/fonts/roboto/Roboto-Regular.woff2', function (req, res) { res.sendFile(__dirname + '/public/fonts/roboto/Roboto-Regular.woff2') });
express.get('/fonts/roboto/Roboto-Bold.woff2', function (req, res) { res.sendFile(__dirname + '/public/fonts/roboto/Roboto-Bold.woff2') });

express.use(function(req, res, next) {
    res.status(404).send("404 Route does not exist, what you doing here?<br> Have a nice day ^_^");
});

