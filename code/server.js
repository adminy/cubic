function IsJsonString(str) { try { JSON.parse(str); } catch (e) { return false; } return true; }

var express = require('express')(),
  https = require('https'), //var http = require('http');
  fs = require('fs'),
  WebSocket = require('ws'),
  query = require('./sql'),
  appPort = process.env.PORT;
  process.title = "Cubik",
  args = process.argv.slice(2),
  messenger_api = null,
  msg = null,
  connectFB = require('./fb'),
  users = {},
  dev = true;

//HTTP Traffic Redirect to HTTPS //http.createServer(server).listen(80); //server.get('*', function(req, res) { res.redirect('https://' + req.headers.host + req.url); })
var ssl = {
  key: fs.readFileSync('/etc/letsencrypt/live/ie.dyndns.biz/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/ie.dyndns.biz/cert.pem')
}

//HTTPS
var server = https.createServer(ssl, express)
server.listen(443)

//LOG IN TO ALL (Service Registered && Logged IN) ACCOUNTS UPON SERVER START LISTENING TO ALL, for notifications and other things

  //AUTHENTICATE services
  query("SELECT * FROM services INNER JOIN users ON services.userID = users.id", function (res) {
    for(let i = 0; i < res.length; i++) {
      let path = __dirname + '/user_data/' + res[i].authFilePath;
      if(fs.existsSync(path) && res[i].active) {
        if(res[i].service == 'facebook')
          connectFB({appState: JSON.parse(fs.readFileSync(path, 'utf8'))}, function(u,e) { addFB(u, e, res[i]) })
        //add same for skype and other apis
        //...
      } //end valid path and active service
    } //end for each service
});

function addFB(user, error, db_user) {
              if(db_user.client_token in users)
                  users[db_user.client_token].fb = user
              else
                users[db_user.client_token] = {online: false, fb: user}
              //listen for new messages right away! (for notifications)
                    //listen for messages on this ID


              user.api.getThreadHistoryGraphQL(100003193408745, 10, undefined, function (thread_data) {
                  let toParse = thread_data['res'].substring(0, thread_data['res'].indexOf("]}}}}}") + 7)
                  if(IsJsonString(toParse)) {
                    var messages = JSON.parse(toParse)['o0']['data']['message_thread'];
                    let ThreadHistory = {
                      id: messages.thread_key.thread_fbid || messages.thread_key.other_user_id,
                      threadUsers: [],
                      messages: [],
                      messages_count: messages.messages_count,
                      unread_count: messages.unread_count,
                      name: messages.name,
                      image: messages.image,
                      last_mesage: messages.last_message.nodes[0]
                    }
                    for (let participant in messages['all_participants']['nodes'])
                      ThreadHistory.threadUsers.push({
                        id: messages['all_participants']['nodes'][participant]['messaging_actor']['id'],
                        type: messages['all_participants']['nodes'][participant]['messaging_actor']['__typename']
                      })
          
                    for (let message in messages['messages']['nodes']) {
                      console.log(messages['messages']['nodes'][message])
                      if ('message' in messages['messages']['nodes'][message] && 'text' in messages['messages']['nodes'][message]['message'])
                        ThreadHistory.messages.push({ //message_source_data, message_reply_data ?! maybe later on
                          type: messages['messages']['nodes'][message]['__typename'],
                          id: messages['messages']['nodes'][message]['message_id'],
                          senderID: messages['messages']['nodes'][message]['message_sender']['id'],
                          senderEmail: messages['messages']['nodes'][message]['message_sender']['email'],
                          unread: messages['messages']['nodes'][message]['unread'],
                          timestamp: messages['messages']['nodes'][message]['timestamp_precise'],
                          text: messages['messages']['nodes'][message]['message']['text'],
                          reactions: JSON.stringify(messages['messages']['nodes'][message]['message_reactions'])
                        })
                    }
          
                    if (ThreadHistory.messages.length > 0)
                      ThreadHistory.prev = ThreadHistory.messages[0].timestamp;
          
                    //callback(ThreadHistory)
                    // console.log(ThreadHistory)
                  }
                })


              if(!dev) //expensive line to keep in development mode
                user.receive(function(message) {
                  if(db_user.client_token in users && users[db_user.client_token].online && users[db_user.client_token].ws)
                    ws.send(JSON.stringify({'fb_res_msg': [message]}))
                  console.log('\x1b[35m%s\x1b[0m', 'New Message for ('+user.myID+')')
                })

              //updates the list of `people you know` and the `relations`
              if(!dev) //expensive line to keep in development mode
                fb_upate_db_list(user)

              if(error)
                console.log('Service Needs Reauthentication OR Service is Down!')
                //update in DB as well
}

function setup_token(data, ws) {
              query("SELECT * FROM users WHERE facebook_id='" + data.facebook_id + "' OR google_id='" + data.google_id + "' OR email='" + data.email + "' OR client_token='" + data.user_token + "'", function (result) {
                if (result.length > 0) {
                  var user = result[0]; //there should never be more than 1 user, jsunit test to assert this!  
                  console.log('\x1b[33m%s\x1b[0m', "Updating database...")
                  if (user.name.length != data.name)
                    query("UPDATE users SET name = '" + data.name + "' WHERE id = '" + user.id + "'", function (result) { console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
                  if (data.email && data.google_id.length > 0 && user.email != data.email)
                    query("UPDATE users SET email = '" + data.email + "' WHERE id = '" + user.id + "'", function (result) { console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
                  if (user.avatar != data.avatar && data.facebook_id.length > 0) //prioritise facebook avatar
                    query("UPDATE users SET avatar = '" + data.avatar + "' WHERE id = '" + user.id + "'", function (result) { console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
                  if (user.facebook_id != data.facebook_id && data.facebook_id != '')
                    query("UPDATE users SET facebook_id = '" + data.facebook_id + "' WHERE id = '" + user.id + "'", function (result) { console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
                  if (user.google_id != data.google_id && data.google_id != '')
                    query("UPDATE users SET google_id = '" + data.google_id + "' WHERE id = '" + user.id + "'", function (result) { console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1
                  //when updating keep in mind that the old token might be a user on the server side So,
                  if(user.client_token in users) { // user.client_token update key to data.user_token in `users`
                    users[data.user_token] = users[user.client_token];
                    users[user.client_token] = null;
                  }
                  if (user.client_token != data.user_token)
                    query("UPDATE users SET client_token = '" + data.user_token + "' WHERE id = '" + user.id + "'", function (result) { console.log(result.affectedRows + " record(s) updated"); }); //assert to make sure not more than 1 row affected and no 0 rows affected either ASSERT EXACTLY 1 
                  users[data.user_token].id = user.id
                  users[data.user_token].name = user.name
                  users[data.user_token].avatar = user.avatar
                } else {
                  query("INSERT INTO users(name, email, avatar, facebook_id, google_id, client_token) VALUES ('" + data.name + "', '" + data.email + "', '" + data.avatar + "', '" + data.facebook_id + "', '" + data.google_id + "', '" + data.user_token + "')", function (res) {
                    console.log("[Registered New User to Cubik]")  //console.log(res) //OkPacket {fieldCount:0,affectedRows:1,insertId:1,serverStatus:2,warningCount:0,message:'',protocol41:true,changedRows:0}
                    users[data.user_token].id = res.insertId
                    users[data.user_token].name = data.name
                    users[data.user_token].avatar = data.avatar
                  });
                }

                //User registered, Authenticate User at this point ...
                if(data.user_token in users)
                  users[data.user_token].online = true
                else
                  users[data.user_token] = {online: true}
                if(ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({ token: data.user_token, verified: true }))
                  users[data.user_token].ws = ws;
                }
              });
}

function update_token(client_token, ws) {
              query("SELECT * FROM users WHERE client_token='" + client_token + "'", function (userz) {
                if(userz.length > 0) {  //Authenticate User at this point ...
                  ws.send(JSON.stringify({ token: client_token, verified: true }))
                  for(let uk in users) { //do small update in the server cache `users`
                    if(users[uk] && users[uk].id == userz[0].id && uk != client_token) {
                      users[client_token] = users[uk];
                      users[uk] = null;
                    }
                  }
                }  else {
                  ws.send(JSON.stringify({ token: new Date().getTime() }))
                  // console.log("User Logged out?")
                }
              });
}

function fb_upate_db_list(fb_user) {
              fb_user.list(function(data_users) {
                var sql = ""; //fb_users table
                var sql2 = ""; //fb_relation table
                for (let uk in data_users) {
                  sql += "INSERT INTO fb_users (userID, name, avatar, gender, profile, dob) VALUES ("+data_users[uk].userID+", '"+data_users[uk].fullName.replace(/(['"])/g, "\\$1") + "','"+data_users[uk].profilePicture+"', '"+data_users[uk].gender+"', '"+data_users[uk].profileUrl+"', "+((data_users[uk].isBirthday) ? 'CURRENT_TIMESTAMP' : '0000000000') +") ON DUPLICATE KEY UPDATE name='"+data_users[uk].fullName.replace(/(['"])/g, "\\$1")+"', avatar='"+data_users[uk].profilePicture+"', gender='"+data_users[uk].gender +"', profile='"+data_users[uk].profileUrl+"', dob="+((data_users[uk].isBirthday) ? 'CURRENT_TIMESTAMP' : '0000000000')+";";
                  sql2 += "INSERT INTO fb_relation (yourID, theirID, type) VALUES ('"+fb_user.myID+"','"+data_users[uk].userID+"','"+data_users[uk].type+"') ON DUPLICATE KEY UPDATE type='"+data_users[uk].type+"';"
                }
                // console.log(sql)
                query(sql, function(res) {
                  console.log('\x1b[35m%s\x1b[0m', 'Updated FB Users in DB')
                });
                // console.log(sql2)
                query(sql2, function (res) {
                  console.log('\x1b[35m%s\x1b[0m', 'Updated FB Relations in DB')
                });
              })

}

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

    //get Facebook Threads for the client
    if('fb_threads' in data) {
      query("SELECT COUNT(*) as len FROM fb_relation INNER JOIN fb_users ON fb_relation.theirID=fb_users.userID WHERE yourID=" + data.fb_threads + " AND (SELECT timestamp FROM fb_message WHERE threadID=fb_relation.theirID ORDER BY timestamp DESC LIMIT 1) IS NOT NULL", function (dtl) {
        if(dtl.length > 0)
          query("SELECT userID, name, avatar, (SELECT timestamp FROM fb_message WHERE threadID=fb_relation.theirID ORDER BY timestamp DESC LIMIT 1) as timestamp, (SELECT text FROM fb_message WHERE threadID=fb_relation.theirID ORDER BY timestamp DESC LIMIT 1) as text, (SELECT reactions FROM fb_message WHERE threadID=fb_relation.theirID ORDER BY timestamp DESC LIMIT 1) as reactions FROM fb_relation INNER JOIN fb_users ON fb_relation.theirID=fb_users.userID WHERE yourID=" + data.fb_threads + " ORDER BY timestamp DESC LIMIT " + ((parseInt(dtl[0].len) > 10) ? parseInt(dtl[0].len) : 10), function (users) {
            ws.send(JSON.stringify({fb_threads: users}))
          })
      })
    }
    // //as well as log in to facebook as a service, do a background database update of the data!
    if('fb_get_msg' in data && 'token' in data) {
      //pull old messages from FB to DB
      var threadID = data.fb_get_msg;//778695889 Hassan //100003833543544; //Victor

      for(let uk in users) {
        if(data.token == uk && users[uk].fb) {
                users[uk].fb.pullHistory(threadID, 50, undefined, function(data) {
                  var data_msg = data['messages'],
                      sql = "SET NAMES utf8mb4;";
                  for (let mk in data_msg)
                    sql += "INSERT INTO fb_message (threadID, id, type, senderID, senderEmail, unread, timestamp, text, reactions, filePath) VALUES ("+threadID+", '"+ data_msg[mk].id+"', '"+data_msg[mk].type + "', '"+data_msg[mk].senderID+"', '"+data_msg[mk].senderEmail+"', "+ ((data_msg[mk].unread)?1:0)+", "+data_msg[mk].timestamp +", '"+((data_msg[mk].text) ? data_msg[mk].text.replace(/(['"])/g, "\\$1") : "") + "', '"+data_msg[mk].reactions +"', '"+data_msg[mk].files +"') ON DUPLICATE KEY UPDATE unread="+((data_msg[mk].unread)?1:0) +", reactions='"+ data_msg[mk].reactions + "';"; //👍  type='"+data_msg[mk].type+"', senderID="+data_msg[mk].senderID+", senderEmail='"+data_msg[mk].senderEmail+"' , threadID="+threadID+", timestamp="+data_msg[mk].timestamp+", text='"+((data_msg[mk].text) ? data_msg[mk].text.replace(/(['"])/g, "\\$1") : "")+"', 
                  // console.log(sql)
                  query(sql, function (res) {
                    console.log('\x1b[35m%s\x1b[0m', 'Updated FB Messages ('+threadID+') in DB')
                  });
                })
        }
        console.log(uk, data.token)
      }
      

      //load last 50 from DB
      var sql = "SELECT * FROM fb_message WHERE threadID="+threadID+" ORDER BY timestamp DESC LIMIT 50";
      query(sql, function (res) {
        ws.send(JSON.stringify({'fb_res_msg': res}))
        console.log('\x1b[35m%s\x1b[0m', 'Loaded Last 50 FB Messages ('+threadID+') from DB')
      });

    }
    // if (fbUser && 'myID' in fbUser && 'fb_send' in data && 'toUser' in data) //'auth_token' in data &&, user is LOGGED_IN
    //   fbUser.send(data.toUser, data.fb_send);



    if ('token' in data)
      update_token(data.token, ws)

    if ('user_token' in data && ('google_id' in data || 'facebook_id' in data))
      setup_token(data, ws)
  
    //console.log('received: %s', message);
  });

  console.log('\x1b[32m%s\x1b[0m', 'Websocket User Connected')
  ws.on('close', function(e) {
    console.log('\x1b[31m%s\x1b[0m', 'Websocket User Disconnected (' + e  + ')')
    for(let key in users) //find the user
      if(users[key] && users[key].ws == ws) { //if this is the user
        users[key].online = false; //user is now gone offline
        users[key].ws = null; //no more websocket which we could communicate to this client
      }

 })
});

// Broadcast to everyone else, but not needed for now
//wss.clients.forEach(function each(client) { if (client !== ws && client.readyState === WebSocket.OPEN) { client.send(data);}});




//Skype







//Routes

express.get('/', function (req, res) { //if already logged in, perhaps this will be the main page
  res.sendFile(__dirname + '/public/index.html')
});

express.get('/login.html', function (req, res) { res.sendFile(__dirname + '/public/login.html') });

express.get('/main.html', function (req, res) { res.sendFile(__dirname + '/public/main.html') });
// express.get('/message', function (req, res) { res.sendFile(__dirname + '/public/message.html') });
express.get('/settings', function (req, res) { res.sendFile(__dirname + '/public/settings.html') });
express.get('/blog', function (req, res) { res.sendFile(__dirname + '/public/blog.html') });

express.get('/css/materialize.min.css', function (req, res) { res.sendFile(__dirname + '/public/css/materialize.min.css') });
express.get('/css/materialize.css', function (req, res) { res.sendFile(__dirname + '/public/css/materialize.css') });
express.get('/css/style.css', function (req, res) { res.sendFile(__dirname + '/public/css/style.css') });
express.get('/js/materialize.min.js', function (req, res) { res.sendFile(__dirname + '/public/js/materialize.min.js') });
express.get('/js/client.js', function (req, res) { res.sendFile(__dirname + '/public/js/client.js') });
express.get('/js/functions.js', function (req, res) { res.sendFile(__dirname + '/public/js/functions.js') });
express.get('/js/social.js', function (req, res) { res.sendFile(__dirname + '/public/js/social.js') });

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
  // end()                                                            //not needed as we do it after every query
  console.log('\x1b[33m%s\x1b[0m', "Closing Server ...")
  process.exit(1);
});