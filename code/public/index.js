class User {
  constructor(client_token, ws) {
    this.client_token = client_token; //id will be checked to indentify the user's token from the client
    this.online = true;
    this.ws = ws;
    this.google_id = "";
    this.facebook_id = "";
    this.avatar = "";
    this.email = "";
  }
}

var express = require('express')(),
    https = require('https'), //var http = require('http');
    fs = require('fs'),
    WebSocket = require('ws'),
    mysql = require('mysql'),
    user_index = 0,
    users = [],
    con = mysql.createConnection({
      host: "mysql.hostinger.co.uk",
      user: "u894154994_cubik",
      password: "password",
      database: "u894154994_cubik"
    });

    function INSERT(sql) {
      con.connect(function(err) {
        if (err) throw err;
        //console.log("Connected!");
        con.query(sql, function (err, result) {
          if (err) throw err;
          //console.log("1 record inserted");
        });
      });
      return "INSERTED"
    }
    //if(INSERT("INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')") == "INSERTED") {}
    function SELECT(sql) {
      var res, cols;
      con.connect(function(err) {
        if (err) throw err;
        con.query(sql, function (err, result, fields) {
          if (err) throw err;
          //console.log(result);
          res = result;
          cols = fields;
        });
      });
      con.end()
      return {results: res, fields: cols}
    }
    //var select = SELECT("SELECT * FROM customers"); if("results" in select && "fields" in select) { select.results, select.fields }

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
        var data = JSON.parse(message)

        if('token' in data) {
          let found = false
          for(let i = 0; i < users.length; i++)
            if(users[i].token == data.user_token)
              found = true
      
          if(found) //token exists, remember the user!
            ws.send(JSON.stringify({token: data.user_token}))
          else
            ws.send(JSON.stringify({request_accept_new_token: new Date().getTime() + user_index++}))
        }


          
      
        if('user_token' in data && ('google_id' in data || 'facebook_id' in data) ) { //&& 'email' in data
          //console.log(data) //google logged in
          // var query = SELECT("SELECT * FROM users WHERE facebook_id='"+data.facebook_id+"' OR google_id='"+data.google_id+"' OR email='"+data.email+"'")
          // console.log(query)
          // if(query.length > 0) { //account exists
            // check if there is any updates needed to be done
            // console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
          // }
          // else { //new user

            // INSERT("INSERT INTO users(name, email, avatar, facebook_id, google_id, client_token) VALUES ('"+data.name+"', '"+data.email+"', '"+data.avatar+"', '"+data.facebook_id+"', '"+data.google_id+"')")
          // }
          console.log(data)
        }
        //console.log('received: %s', message);
        //console.log(data)
      });

      //we are going to send each user a very unique token key,
      //it will make each connection not so unique but user unique!
      //so even if ws changes the user can stay unique :)
      ws.send(JSON.stringify({token: new Date().getTime() + user_index++})); //new User('id' + i + time()) //unique enough? do sha256 of that
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
express.get('/fonts/roboto/Roboto-Medium.woff2', function (req, res) { res.sendFile(__dirname + '/public/fonts/roboto/Roboto-Medium.woff2') });
express.get('/fonts/roboto/Roboto-Bold.woff2', function (req, res) { res.sendFile(__dirname + '/public/fonts/roboto/Roboto-Bold.woff2') });


express.use(function(req, res, next) {
    res.status(404).send("404 Route does not exist, what you doing here?<br> Have a nice day ^_^");
});

