var express = require('express')(),
    https = require('https'), //var http = require('http');
    fs = require('fs'),
    WebSocket = require('ws')

//HTTP Traffic Redirect to HTTPS //http.createServer(server).listen(80); //server.get('*', function(req, res) { res.redirect('https://' + req.headers.host + req.url); })
var ssl = {
  key: fs.readFileSync('/etc/letsencrypt/live/ie.dyndns.tv/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/ie.dyndns.tv/cert.pem')
}

//HTTPS
var server = https.createServer(ssl, express)
    server.listen(443)
//WSS
var wss = new WebSocket.Server({server:server});
    wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        console.log('received: %s', message);
      });

      ws.send('something');
    });



express.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html') //res.send("Hello World!");
});
express.get('/main', function (req, res) { res.sendFile(__dirname + '/public/main.html') });
express.get('/personal', function (req, res) { res.sendFile(__dirname + '/public/persona.html') });
express.get('/resister', function (req, res) { res.sendFile(__dirname + '/public/Register.html') });
express.get('/settings', function (req, res) { res.sendFile(__dirname + '/public/setting.html') });

express.get('/css/materialize.min.css', function (req, res) { res.sendFile(__dirname + '/public/css/materialize.min.css') });
express.get('/js/materialize.min.js', function (req, res) { res.sendFile(__dirname + '/public/js/materialize.min.js') });

express.get('/images/Cubik.png', function (req, res) { res.sendFile(__dirname + '/public/images/Cubik.png') });
express.get('/images/male.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/male.jpg') });
express.get('/images/mom.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/mom.jpg') });
express.get('/images/femaleblonde.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/femaleblonde.jpg') });
express.get('/images/asian.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/asian.jpg') });

//express.use(function(req, res, next) {
//    res.status(404).send("404 Route does not exist, what you doing here?<br> Have a nice day ^_^");
//});

