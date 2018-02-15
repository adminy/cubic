var express = require('express')(),
    https = require('https'), //var http = require('http');
    fs = require('fs'),
    WebSocket = require('ws'),
    mysql = require('mysql'),
    con = mysql.createConnection("mysql://u894154994_cubik:password@sql32.main-hosting.eu:3306/u894154994_cubik"),
    appPort = process.env.PORT;
    process.title = "Cubik";
function queryEnd() { con.end(); con = mysql.createConnection("mysql://u894154994_cubik:password@sql32.main-hosting.eu:3306/u894154994_cubik") }
  
//HTTP Traffic Redirect to HTTPS //http.createServer(server).listen(80); //server.get('*', function(req, res) { res.redirect('https://' + req.headers.host + req.url); })
var ssl = {
  key: fs.readFileSync('/etc/letsencrypt/live/ie.dyndns.biz/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/ie.dyndns.biz/cert.pem')
}

//HTTPS
var server = https.createServer(ssl, express)
    server.listen(443)
//MYSQL
  // con.connect(function(err) {
  //   if (err) throw err;
  // });
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
          con.query("SELECT * FROM users WHERE client_token='"+data.token+"'", function (err, users) {
            if (err) throw err;
            
            if(users.length > 0) //Authenticate User at this point ...
              ws.send(JSON.stringify({token: data.user_token, verified: true}))
            else
              ws.send(JSON.stringify({token: new Date().getTime()}))

            queryEnd()
          });
           
        }


          
      
        if('user_token' in data && ('google_id' in data || 'facebook_id' in data) ) { //&& 'email' in data
          con.query("SELECT * FROM users WHERE facebook_id='"+data.facebook_id+"' OR google_id='"+data.google_id+"' OR email='"+data.email+"' OR client_token='"+data.user_token+"'", function (err, users) {
            if (err) throw err;
            if(users.length > 0) {
              var user = users[0]; //there should never be more than 1 user, jsunit test to assert this!
              console.log('\x1b[33m%s\x1b[0m', "Updating database...")
              if(user.name.length != data.name)
                con.query("UPDATE users SET name = '"+data.name+"' WHERE id = '"+user.id+"'", function (err, result) { if (err) throw err; console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
              if(data.email && data.google_id.length > 0 && user.email != data.email)
                con.query("UPDATE users SET email = '"+data.email+"' WHERE id = '"+user.id+"'", function (err, result) { if (err) throw err; console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
              if(user.avatar != data.avatar && data.facebook_id.length > 0) //prioritise facebook avatar
                con.query("UPDATE users SET avatar = '"+data.avatar+"' WHERE id = '"+user.id+"'", function (err, result) { if (err) throw err; console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
              if(user.facebook_id != data.facebook_id && data.facebook_id != '')
                con.query("UPDATE users SET facebook_id = '"+data.facebook_id+"' WHERE id = '"+user.id+"'", function (err, result) { if (err) throw err; console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
              if(user.google_id != data.google_id && data.google_id != '')
                con.query("UPDATE users SET google_id = '"+data.google_id+"' WHERE id = '"+user.id+"'", function (err, result) { if (err) throw err; console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
              if(user.client_token != data.user_token)
                con.query("UPDATE users SET client_token = '"+data.user_token+"' WHERE id = '"+user.id+"'", function (err, result) { if (err) throw err; console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
              //Authenticate User at this point ...
              ws.send(JSON.stringify({token: data.user_token, verified: true}))
            } else {
              con.query("INSERT INTO users(name, email, avatar, facebook_id, google_id, client_token) VALUES ('"+data.name+"', '"+data.email+"', '"+data.avatar+"', '"+data.facebook_id+"', '"+data.google_id+"', '"+data.user_token+"')", function (err, res) {
                if (err) throw err
                console.log("1 record inserted")
                //console.log(res) //OkPacket {fieldCount:0,affectedRows:1,insertId:1,serverStatus:2,warningCount:0,message:'',protocol41:true,changedRows:0}
              });
              //User registered, Authenticate User at this point ...
            }
            
            
            queryEnd()
         });

          // console.log(data)
        }
        //console.log('received: %s', message);
      });

      //we are going to send each user a very unique token key,
      //it will make each connection not so unique but user unique!
      //so even if ws changes the user can stay unique :)
      // ws.send(JSON.stringify({token: new Date().getTime()})); //new User('id' + i + time()) //unique enough? do sha256 of that
    });

 // Broadcast to everyone else, but not needed for now
 //wss.clients.forEach(function each(client) { if (client !== ws && client.readyState === WebSocket.OPEN) { client.send(data);}});



//Routes

express.get('/', function (req, res) { //if already logged in, perhaps this will be the main page
  res.sendFile(__dirname + '/public/index.html')
});

express.get('/login', function (req, res) { res.sendFile(__dirname + '/public/login.html') });

express.get('/main', function (req, res) { res.sendFile(__dirname + '/public/main.html') });
express.get('/personal', function (req, res) { res.sendFile(__dirname + '/public/personal.html') });
express.get('/settings', function (req, res) { res.sendFile(__dirname + '/public/settings.html') });

express.get('/css/materialize.min.css', function (req, res) { res.sendFile(__dirname + '/public/css/materialize.min.css') });
express.get('/css/materialize.css', function (req, res) { res.sendFile(__dirname + '/public/css/materialize.css') });
express.get('/js/materialize.min.js', function (req, res) { res.sendFile(__dirname + '/public/js/materialize.min.js') });
express.get('/js/client.js', function (req, res) { res.sendFile(__dirname + '/public/js/client.js') });

express.get('/images/Cubik.png', function (req, res) { res.sendFile(__dirname + '/public/images/Cubik.png') });
express.get('/images/male.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/male.jpg') });
express.get('/images/mom.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/mom.jpg') });
express.get('/images/femaleblonde.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/femaleblonde.jpg') });
express.get('/images/asian.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/asian.jpg') });

express.get('/fonts/roboto/Roboto-Regular.woff2', function (req, res) { res.sendFile(__dirname + '/public/fonts/roboto/Roboto-Regular.woff2') });
express.get('/fonts/roboto/Roboto-Medium.woff2', function (req, res) { res.sendFile(__dirname + '/public/fonts/roboto/Roboto-Medium.woff2') });
express.get('/fonts/roboto/Roboto-Bold.woff2', function (req, res) { res.sendFile(__dirname + '/public/fonts/roboto/Roboto-Bold.woff2') });

express.get('/privacy', function (req, res) { res.sendFile(__dirname + '/public/privacy.html') });
express.get('/tos', function (req, res) { res.sendFile(__dirname + '/public/privacy.html') });


express.use(function(req, res, next) {
    res.status(404).send("404 Route does not exist, what you doing here?<br> Have a nice day ^_^");
});



process.on('SIGINT', function() {
  // console.log('\x1b[33m%s\x1b[0m', "\nClosing MySQL Connection")
  // con.end()                                                            //not needed as we do it after every query
  console.log('\x1b[33m%s\x1b[0m', "Closing Server ...")
  process.exit(1);
});




//another test is maybe DB connection?
      // con.connect(function(err) {
      //   if (err) throw err;
      // });
