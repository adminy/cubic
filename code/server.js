var express = require('express')(),
  https = require('https'), //var http = require('http');
  fs = require('fs'),
  WebSocket = require('ws'),
  query = require('./sql'),
  appPort = process.env.PORT;
  process.title = "Cubik",
  args = process.argv.slice(2),
  login = require("facebook-chat-api"),
  messenger_api = null,
  msg = null,
  connectFB = require('./fb'),
  fbUser = null;

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

//LOG IN TO ALL (Service Registered && Logged IN) ACCOUNTS UPON SERVER START LISTENING TO ALL, for notifications and other things

//   //AUTHENTICATE services
//   con.query("SELECT * FROM services", function (err, res) {
//     if (err) throw err; //query error

//     for(let i = 0; i < res.length; i++) {
//       let path = __dirname + '/user_data/' + res[i].authFilePath;
//       if(fs.existsSync(path) && res[i].active) {
//         if(res[i].service == 'facebook')
//           connectFB({appState: JSON.parse(fs.readFileSync(path, 'utf8'))}, addFB)
//         //add same for skype and other apis
//         //...

//       } //end valid path and active service
//     } //end for each service
//     queryEnd()
// });

// function addFB(user, error) {
//   //listen for new messages right away! (for notifications)
//   fbUser = user; //deprecated ...
//   //if(!(user in users)) users.push(user);
 
//   if(error)
//     console.log('Service Needs Reauthentication OR Service is Down!')
//     //update in DB as well
// }

//WSS
var wss = new WebSocket.Server({ server: server });
wss.on('connection', function connection(ws, req) { //req.connection.remoteAddress, req.url, even cookies and other request url data

  //ws is an active connection, but not a user in our case
  //so instead check in message for the token we give to our users,
  // verify it being in the user's list we create!

  //client sending a message, remember to look for an user then
  //answer the client query as a user.
  ws.on('message', function incoming(message) {
    var data = JSON.parse(message)

    // // if ('messenger_login' in data) //'auth_token' in data && 
    // //   connectFB('valid_cookie_path/credentials JSON', function (fb_user) { fbUser = fb_user; })
    // //as well as log in to facebook as a service, do a background database update of the data!
    // if('fb_get_msg' in data) {
    //   //pull old messages from FB to DB
    //   var threadID = data.fb_get_msg;//778695889 Hassan //100003833543544; //Victor
    //   if(fbUser && 'myID' in fbUser) {
    //     fbUser.pullHistory(threadID, 50, undefined, function(data) { //hopefully 100kk is all you're ever gonna have, also perhaps stick a number which represents reasonable after some time of pulling over and over, old messages should no longer be updated
    //     var data_msg = data['messages'];
    //       var sql = "SET NAMES utf8mb4;";
    //       for (let mk in data_msg)
    //         sql += "INSERT INTO fb_message (threadID, id, type, senderID, senderEmail, unread, timestamp, text, reactions, filePath) VALUES ("+threadID+", '"+ data_msg[mk].id+"', '"+data_msg[mk].type + "', '"+data_msg[mk].senderID+"', '"+data_msg[mk].senderEmail+"', "+ ((data_msg[mk].unread)?1:0)+", "+data_msg[mk].timestamp +", '"+((data_msg[mk].text) ? data_msg[mk].text.replace(/(['"])/g, "\\$1") : "") + "', '"+data_msg[mk].reactions +"', '') ON DUPLICATE KEY UPDATE unread="+((data_msg[mk].unread)?1:0) +", reactions='"+ data_msg[mk].reactions + "';"; //👍  type='"+data_msg[mk].type+"', senderID="+data_msg[mk].senderID+", senderEmail='"+data_msg[mk].senderEmail+"' , threadID="+threadID+", timestamp="+data_msg[mk].timestamp+", text='"+((data_msg[mk].text) ? data_msg[mk].text.replace(/(['"])/g, "\\$1") : "")+"', 
    //       // console.log(sql)
    //       con.query(sql, function (err, res) {
    //         if (err) throw err;
    //         console.log('\x1b[35m%s\x1b[0m', 'Updated FB Messages ('+threadID+') in DB')
    //         queryEnd()
    //       });
    //     })

    //   //listen for messages on this ID
    //     fbUser.receive(function(message) {
    //       ws.send(JSON.stringify({'fb_res_msg': [message]}))
    //       console.log('\x1b[35m%s\x1b[0m', 'New Message for ('+fbUser.myID+')')
    //     })
    //   }
    //   //load last 50 from DB
    //   var sql = "SELECT * FROM fb_message WHERE threadID="+data.fb_get_msg+" ORDER BY timestamp DESC LIMIT 50";
    //   con.query(sql, function (err, res) {
    //     if (err) throw err;
    //     ws.send(JSON.stringify({'fb_res_msg': res}))
    //     console.log('\x1b[35m%s\x1b[0m', 'Loaded Last 50 FB Messages ('+data.fb_get_msg+') in DB')
    //     queryEnd()
    //   });

    // }
    // if (fbUser && 'myID' in fbUser && 'fb_send' in data && 'toUser' in data) //'auth_token' in data &&, user is LOGGED_IN
    //   fbUser.send(data.toUser, data.fb_send);


    // if ('messenger_list' in data) //'auth_token' in data &&, user is LOGGED_IN
    //   fbUser.list(function (data_users) {
    //     var sql = ""; //fb_users table
    //     var sql2 = ""; //fb_relation table
    //     for (let uk in data_users) {
    //       sql += "INSERT INTO fb_users (userID, name, avatar, gender, profile, dob) VALUES ("+data_users[uk].userID+", '"+data_users[uk].fullName.replace(/(['"])/g, "\\$1") + "','"+data_users[uk].profilePicture+"', '"+data_users[uk].gender+"', '"+data_users[uk].profileUrl+"', "+((data_users[uk].isBirthday) ? 'CURRENT_TIMESTAMP' : '0000000000') +") ON DUPLICATE KEY UPDATE name='"+data_users[uk].fullName.replace(/(['"])/g, "\\$1")+"', avatar='"+data_users[uk].profilePicture+"', gender='"+data_users[uk].gender +"', profile='"+data_users[uk].profileUrl+"', dob="+((data_users[uk].isBirthday) ? 'CURRENT_TIMESTAMP' : '0000000000')+";";
    //       sql2 += "INSERT INTO fb_relation (yourID, theirID, type) VALUES ('"+fbUser.myID+"','"+data_users[uk].userID+"','"+data_users[uk].type+"') ON DUPLICATE KEY UPDATE type='"+data_users[uk].type+"';"
    //     }
    //     // console.log(sql)
    //     con.query(sql, function (err, res) {
    //       if (err) throw err;
    //       console.log('\x1b[35m%s\x1b[0m', 'Updated FB Users in DB')
    //       queryEnd()
    //     });
    //     // console.log(sql2)
    //     con.query(sql2, function (err, res) {
    //       if (err) throw err;
    //       console.log('\x1b[35m%s\x1b[0m', 'Updated FB Relations in DB')
    //       queryEnd()
    //     });
    //   })

    // if ('token' in data) {
    //   con.query("SELECT * FROM users WHERE client_token='" + data.token + "'", function (err, users) {
    //     if (err) throw err;

    //     if (users.length > 0) //Authenticate User at this point ...
    //       ws.send(JSON.stringify({ token: data.user_token, verified: true }))
    //     else
    //       ws.send(JSON.stringify({ token: new Date().getTime() }))

    //     queryEnd()
    //   });

    // }


    if('get_fb_threads' in data) {
      query("SELECT userID, name, avatar, (SELECT timestamp FROM fb_message WHERE userID=fb_relation.theirID ORDER BY timestamp DESC LIMIT 1) as timestamp, (SELECT text FROM fb_message WHERE userID=fb_relation.theirID ORDER BY timestamp DESC LIMIT 1) as text FROM fb_relation INNER JOIN fb_users ON fb_relation.theirID=fb_users.userID WHERE yourID=" + data.get_fb_threads, function (users) {
        ws.send(JSON.stringify({fb_threads: users}))
      })
    }

    // if ('user_token' in data && ('google_id' in data || 'facebook_id' in data)) { //&& 'email' in data
    //   con.query("SELECT * FROM users WHERE facebook_id='" + data.facebook_id + "' OR google_id='" + data.google_id + "' OR email='" + data.email + "' OR client_token='" + data.user_token + "'", function (err, users) {
    //     if (err) throw err;
    //     if (users.length > 0) {
    //       var user = users[0]; //there should never be more than 1 user, jsunit test to assert this!
    //       console.log('\x1b[33m%s\x1b[0m', "Updating database...")
    //       if (user.name.length != data.name)
    //         con.query("UPDATE users SET name = '" + data.name + "' WHERE id = '" + user.id + "'", function (err, result) { if (err) throw err; console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
    //       if (data.email && data.google_id.length > 0 && user.email != data.email)
    //         con.query("UPDATE users SET email = '" + data.email + "' WHERE id = '" + user.id + "'", function (err, result) { if (err) throw err; console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
    //       if (user.avatar != data.avatar && data.facebook_id.length > 0) //prioritise facebook avatar
    //         con.query("UPDATE users SET avatar = '" + data.avatar + "' WHERE id = '" + user.id + "'", function (err, result) { if (err) throw err; console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
    //       if (user.facebook_id != data.facebook_id && data.facebook_id != '')
    //         con.query("UPDATE users SET facebook_id = '" + data.facebook_id + "' WHERE id = '" + user.id + "'", function (err, result) { if (err) throw err; console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
    //       if (user.google_id != data.google_id && data.google_id != '')
    //         con.query("UPDATE users SET google_id = '" + data.google_id + "' WHERE id = '" + user.id + "'", function (err, result) { if (err) throw err; console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
    //       if (user.client_token != data.user_token)
    //         con.query("UPDATE users SET client_token = '" + data.user_token + "' WHERE id = '" + user.id + "'", function (err, result) { if (err) throw err; console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
    //       //Authenticate User at this point ...
    //       ws.send(JSON.stringify({ token: data.user_token, verified: true }))
    //     } else {
    //       con.query("INSERT INTO users(name, email, avatar, facebook_id, google_id, client_token) VALUES ('" + data.name + "', '" + data.email + "', '" + data.avatar + "', '" + data.facebook_id + "', '" + data.google_id + "', '" + data.user_token + "')", function (err, res) {
    //         if (err) throw err
    //         console.log("1 record inserted")
    //         //console.log(res) //OkPacket {fieldCount:0,affectedRows:1,insertId:1,serverStatus:2,warningCount:0,message:'',protocol41:true,changedRows:0}
    //       });
    //       //User registered, Authenticate User at this point ...
    //     }


    //     queryEnd()
    //   });

  //     // console.log(data)
    // }
    //console.log('received: %s', message);
  });

  //we are going to send each user a very unique token key,
  //it will make each connection not so unique but user unique!
  //so even if ws changes the user can stay unique :)
  // ws.send(JSON.stringify({token: new Date().getTime()})); //new User('id' + i + time()) //unique enough? do sha256 of that
});

// Broadcast to everyone else, but not needed for now
//wss.clients.forEach(function each(client) { if (client !== ws && client.readyState === WebSocket.OPEN) { client.send(data);}});




//Skype







//Routes

express.get('/', function (req, res) { //if already logged in, perhaps this will be the main page
  res.sendFile(__dirname + '/public/index.html')
});

express.get('/login', function (req, res) { res.sendFile(__dirname + '/public/login.html') });

express.get('/main', function (req, res) { res.sendFile(__dirname + '/public/main.html') });
express.get('/message', function (req, res) { res.sendFile(__dirname + '/public/message.html') });
express.get('/settings', function (req, res) { res.sendFile(__dirname + '/public/settings.html') });
express.get('/blog', function (req, res) { res.sendFile(__dirname + '/public/blog.html') });

express.get('/css/materialize.min.css', function (req, res) { res.sendFile(__dirname + '/public/css/materialize.min.css') });
express.get('/css/materialize.css', function (req, res) { res.sendFile(__dirname + '/public/css/materialize.css') });
express.get('/css/style.css', function (req, res) { res.sendFile(__dirname + '/public/css/style.css') });
express.get('/js/materialize.min.js', function (req, res) { res.sendFile(__dirname + '/public/js/materialize.min.js') });
express.get('/js/client.js', function (req, res) { res.sendFile(__dirname + '/public/js/client.js') });

express.get('/images/Cubik.png', function (req, res) { res.sendFile(__dirname + '/public/images/Cubik.png') });
express.get('/images/male.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/male.jpg') });
express.get('/images/mom.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/mom.jpg') });
express.get('/images/femaleblonde.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/femaleblonde.jpg') });
express.get('/images/asian.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/asian.jpg') });
express.get('/images/wavy.jpg', function (req, res) { res.sendFile(__dirname + '/public/images/wavy.jpg') });

express.get('/fonts/roboto/Roboto-Regular.woff2', function (req, res) { res.sendFile(__dirname + '/public/fonts/roboto/Roboto-Regular.woff2') });
express.get('/fonts/roboto/Roboto-Medium.woff2', function (req, res) { res.sendFile(__dirname + '/public/fonts/roboto/Roboto-Medium.woff2') });
express.get('/fonts/roboto/Roboto-Bold.woff2', function (req, res) { res.sendFile(__dirname + '/public/fonts/roboto/Roboto-Bold.woff2') });

express.get('/privacy', function (req, res) { res.sendFile(__dirname + '/public/privacy.html') });
express.get('/tos', function (req, res) { res.sendFile(__dirname + '/public/privacy.html') });


express.use(function (req, res, next) {
  res.status(404).send("404 Route does not exist, what you doing here?<br> Have a nice day ^_^");
});



process.on('SIGINT', function () {
  // console.log('\x1b[34m%s\x1b[0m', "\nSaving Messenger Session")
  // fs.writeFileSync('appstate.json', JSON.stringify(messenger_api.getAppState()));
  // con.end()                                                            //not needed as we do it after every query
  console.log('\x1b[33m%s\x1b[0m', "Closing Server ...")
  process.exit(1);
});




//another test is maybe DB connection?
      // con.connect(function(err) {
      //   if (err) throw err;
      // });
