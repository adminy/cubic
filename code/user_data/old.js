    //add services
    if('token' in data && 'user' in data && 'pass' in data && 'service_name' in data) {
        //make a check for ' || " || `
        query("SELECT id FROM users WHERE client_token="+con.escape(data.token)+";SELECT COUNT(userID) as found FROM users JOIN services ON users.id = services.userID WHERE client_token='"+data.token+"' AND service='" + data.service_name + "' AND user='" + data.user + "'", function (res) {
          if(res[1][0].found > 0) {
            ws.send(JSON.stringify({'service_already_registered': ''}))
          } else {
            if(res[0].length > 0) 
              query("INSERT INTO services(userID, service, authFilePath, user, pass, active) VALUES ("+res[0][0].id+","+con.escape(data.service_name)+",'',"+con.escape(data.user)+","+con.escape(data.pass)+",1)", function() {
                ws.send(JSON.stringify({'service_successfully_registered': {service_name: data.service_name, user: data.user}}))
                console.log("New " + data.service_name + " service with User:" + data.user)
              })
            
  
          }
        
        //INSERT  userID, name, avatar, service, user FROM users JOIN services ON users.id = services.userID WHERE client_token='"+data.my_services+"'", function (res) {
          ws.send(JSON.stringify({my_services: res}))
        })
      }
  
      //list of services for the logged in user, `my_services` contains the `client_token` for that user
      if('my_services' in data && ws) {
        query("SELECT userID, name, avatar, service, user FROM users JOIN services ON users.id = services.userID WHERE client_token='"+data.my_services+"'", function (res) {
          ws.send(JSON.stringify({my_services: res}))
        })
  
        
      }
  
      //get Facebook Threads for the client
      if('fb_threads' in data) { 
        //first query determines if you have at least 10 people in this app which you tried talking to, if not it'll show you 10 random people, else it will show you all the ones you did talk with
        //now the beauty is that we have a listener, so even if you're new to the app, if you have friends who talk to you, the app will sort those people as we register to what we listen for better notifications system. of course we know it's a little outdated but it works and It took a lot to get it at least to this state, with future improvements perhaps the new feature will be implemented
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
        var threadID = data.fb_get_msg; //eg: `778695889` - Hassan | `100003833543544` - Victor
  
        for(let uk in users) {
          if(data.token == uk && users[uk] && users[uk].fb) {
                //mark as read when entering a conversation thread
                users[uk].fb.api.markAsRead(threadID) //make this user specific in the future, when user specifies to have them read or not, more user in control ages
  
                users[uk].fb.pullThreadInfo(threadID, function(threadInfo) {
                  // console.log("Thread ("+ threadID+ ") has " + threadInfo.unread_count + " messages to read...")
                  // console.log("Total Messages in ("+threadID+") is: " + threadInfo.total_msg)
                  //first SQL sets formatting, Seconds returns total_msg in a Thread, Third returns if last message is what we have
                    var sql3 = "SELECT copy_old_msg FROM fb_relation WHERE theirID="+threadID+";"
                        sql3 += "SELECT count(id) as total_msg FROM fb_message WHERE threadID="+threadID+";"
                        sql3 += "SELECT COUNT(id) as found FROM fb_message WHERE threadID="+threadID+" AND timestamp="+ threadInfo.last_message.timestamp_precise; //if we have the latest message
                    query(sql3, function (res) {
                      //we download from beggining ALL messages
                      if(res[0].length > 0 && res[0][0].copy_old_msg == "0") {
                          //threadID, fb_user, last_message_timestamp, itterations (total_messages/messages_per_itteration + 1), this_function
                          download_thread_history(threadID, users[uk].fb, undefined, Math.ceil(threadInfo.total_msg / 100), download_thread_history)
                          query("UPDATE fb_relation SET copy_old_msg=1 WHERE theirID="+threadID, function() { console.log("Downloaded all messages From: " + threadID) })
                      } else {
                          // console.log("We have the last message but do we have enough messages to say we have as much in DB? TH:" + threadInfo.total_msg + " DB:" + res[1][0].total_msg)
                          //we make a check on all FB messages, count how many we've got. if the difference is up to 8 messages missing of the database don't make a big deal out of it, we got the latest messages
                          //the reason implement this mechanism is that facebook for some reason sometimes does not have as much as they say they do, margin error 8 is the biggest I got in running experiments, hopefully that is as big as it gets
                          if(threadInfo.total_msg - res[1][0].total_msg < 8 && res[2][0].found > 0) { //sometimes the difference is 0 so it's really great :) but what if it was 0 and we don't have the last message? [Ultra Edge Case, Could Happen] then what I say to that is `found` would be the problem, means the date is inprecise, our method on relying on the date is not as good as we thought ? or is it :)
                            //no need to ask facebook for more messages we are up to date
                            console.log('\x1b[32m%s\x1b[0m', 'Up to Date in threadID ('+threadID+') with messages [db:' + res[1][0].total_msg + ' | fb:' + threadInfo.total_msg + ']')
                          } else { //we don't have the latest message pull just the total - what we got (x100)
                            console.log('\x1b[33m%s\x1b[0m', "We still have to download Few Messages Specifically: [db:" + res[1][0].total_msg + " | fb:" + threadInfo.total_msg + "]")
                            download_thread_history(threadID, users[uk].fb, undefined, Math.ceil((threadInfo.total_msg - res[1][0].total_msg) / 100), download_thread_history)
                          }
                      }
  
                            //load last 50 from DB
                            var sql = "SET NAMES utf8mb4;SELECT * FROM fb_message WHERE threadID="+threadID+" ORDER BY timestamp DESC LIMIT 50";
                            query(sql, function (res) {
                              // console.log(res[1])
                              ws.send(JSON.stringify({'fb_res_msg': res[1]}))
                              console.log('\x1b[35m%s\x1b[0m', 'Loaded Last 50 FB Messages ('+threadID+') from DB')
                            });
  
                    }) // console.log('\x1b[42m%s\x1b[0m', JSON.stringify(threadInfo))
                  })
                  // users[uk].fb.pullHistory(threadID, 50, undefined, function(data) {
                  //   var data_msg = data['messages'],
                  //       sql = "SET NAMES utf8mb4;";
                  //   for (let mk in data_msg)
                  //     sql += "INSERT INTO fb_message (threadID, id, type, isGroup, senderID, unread, timestamp, text, reactions, files) VALUES ("+threadID+", '"+ data_msg[mk].id+"', '"+data_msg[mk].type + "', 0, '"+data_msg[mk].senderID+"', "+ ((data_msg[mk].unread)?1:0)+", "+data_msg[mk].timestamp +", '"+((data_msg[mk].text) ? data_msg[mk].text.replace(/(['"])/g, "\\$1") : "") + "', '"+data_msg[mk].reactions +"', '"+data_msg[mk].files +"') ON DUPLICATE KEY UPDATE unread="+((data_msg[mk].unread)?1:0) +", reactions='"+ data_msg[mk].reactions + "';"; //👍  type='"+data_msg[mk].type+"', senderID="+data_msg[mk].senderID+", senderEmail='"+data_msg[mk].senderEmail+"' , threadID="+threadID+", timestamp="+data_msg[mk].timestamp+", text='"+((data_msg[mk].text) ? data_msg[mk].text.replace(/(['"])/g, "\\$1") : "")+"', 
                  //   // console.log(sql)
                  //   query(sql, function (res) {
                  //     console.log('\x1b[35m%s\x1b[0m', 'Updated FB Messages ('+threadID+') in DB')
                  //   })
                  // })
          }
          //console.log(uk == data.token)
        }
      }
      
      if('fb_send' in data && 'toUser' in data && 'token' in data) {
        for(let uk in users) {
          if(data.token == uk && users[uk] && users[uk].fb) {
            users[uk].fb.send(data.toUser, data.fb_send);
            console.log('\x1b[32m%s\x1b[0m', 'I am sending a message to ('+data.toUser+') saying: ' + ((data.fb_send_file) ? '[FILE]' : data.fb_send))
          }
        }
      }
  
      if('fb_typing' in data && 'token' in data) {
        for(let uk in users) {
          if(data.token == uk && users[uk] && users[uk].fb) {
            users[uk].fb.api.sendTypingIndicator(data.fb_typing)
            console.log('\x1b[32m%s\x1b[0m', 'I am typing to ('+data.fb_typing+')')
          }
        }
      }
  


      // //LOG IN TO ALL (Service Registered && Logged IN) ACCOUNTS UPON SERVER START LISTENING TO ALL, for notifications and other things

// //AUTHENTICATE services
// query("SELECT * FROM services INNER JOIN users ON services.userID = users.id", function (res) {
//     for (let i = 0; i < res.length; i++) {
//         if (res[i].service == 'skype') {
//             SkyLogIn(res[i].user, res[i].pass, function (skype_user) { addSkype(skype_user, res[i]) })
//         }
//         let path = __dirname + '/user_data/' + res[i].authFilePath;
//         if (fs.existsSync(path) && res[i].active) {
//             if (res[i].service == 'facebook')
//                 connectFB({ appState: JSON.parse(fs.readFileSync(path, 'utf8')) }, function (u, e) { addFB(u, e, res[i]) })
//             //add same for skype and other apis
//             //...
//         } //end valid path and active service
//     } //end for each service

//     //send to client service online status, so now they can use the system without breaking it,
//     //the problem is that if a user does before services are not registered, we ignore their token confirmation and they send it,
//     //then our system sends them that we don't have a valid token, it's because we don't have the services which actually define the tokens
//     //SO it can crash BOTH ends if user tries to use the app immediately after the server is up, after services auth, it's safe to do so.

//     //what else we can do to solve this problem is to give the client an user DATABSE ID so that token is not the only way they can AUTHENTICATE
//     //but on one side of the coin this fixes the problem while leaving it more vunerable on the other as tokens are relatively harder to guess than users IDs
//     //but I suppose if we ignore security for now, we can make this run with less errors?

//     //so here is the implementation
// });
// function addSkype(skype_user, db_user) {
//     //skype auth here
// }


// function addFB(user, error, db_user) {
//     if (db_user.client_token in users) {
//         users[db_user.client_token].fb = user
//         users[db_user.client_token].id = db_user.id
//         users[db_user.client_token].name = db_user.name
//         users[db_user.client_token].avatar = db_user.avatar
//     }
//     else {
//         users[db_user.client_token] = { online: false, fb: user, id: db_user.id, name: db_user.name, avatar: db_user.avatar }

//     }
//     //listen for new messages right away! (for notifications)
//     //listen for messages on this ID


//     if (!dev) //expensive line to keep in development mode
//         user.receive(function (message) {
//             if (message.type == 'message') {
//                 //user.api.markAsRead(message.threadID);  //mark as read would be nice to get when user interacts not when our server receives it, but for now we have our own notification
//                 let sql = "SET NAMES utf8mb4;INSERT INTO fb_message (threadID, id, type, isGroup, senderID, unread, timestamp, text, reactions, files) VALUES (" + message.threadID + ", '" + message.messageID + "', '" + message.type + "', " + (message.isGroup ? 1 : 0) + ", '" + message.senderID + "',1, " + message.timestamp + ", " + con.escape((message.body ? message.body.replace(/(['"])/g, "\\$1") : "")) + ", '', '" + JSON.stringify(message.attachments) + "') ON DUPLICATE KEY UPDATE unread=1;";
//                 // console.log(sql)
//                 if (user.lastMessageID != message.messageID) { //prevent dublicates
//                     query(sql, function (res) {
//                         console.log('\x1b[35m%s\x1b[0m', 'Updated FB New Message for (' + message.threadID + ') in DB')
//                         user.lastMessageID = message.messageID; //keeps last message for dublicate prevention
//                     })
//                 }
//                 if (db_user.client_token in users && users[db_user.client_token].ws) //problem with this is that db_user.client_token could have already changed, we don't have the new one
//                     users[db_user.client_token].ws.send(JSON.stringify({ 'fb_res_msg': [message] }))
//             }
//             //  { isTyping: true, from: '778695889', threadID: '100013582237495', fromMobile: true, userID: '778695889', type: 'typ' }
//             if (message.type == 'typ') { // console.log("User is typing ...") //--------- send to user that is online
//                 console.log("User:" + message.from + " Tying:" + message.isTyping + " on " + (message.fromMobile ? 'mobile' : 'desktop'))
//                 if (db_user.client_token in users && users[db_user.client_token].ws) //problem with this is that db_user.client_token could have already changed, we don't have the new one
//                     users[db_user.client_token].ws.send(JSON.stringify({ 'fb_user_typing': message }))
//             }
//         })

//     //updates the list of `people you know` and the `relations`
//     if (!dev) //expensive line to keep in development mode
//         fb_update_db_list(user, 'facebook')

//     if (error)
//         console.log('Service Needs Reauthentication OR Service is Down!')
//     //update in DB as well
// }


// //recursively call `pullHistory` this to get VERY OLD messages in a timely fasion not to annoy facebook [#future - perhaps even run this on a different thread]
// function download_thread_history(threadID, fb_user, last_timestamp, iterations, this_function) {
//                 //recusion in a callback, rediculous but worth a shot
//                 fb_user.pullHistory(threadID, 100, last_timestamp, function(data) { //100 messages every half a second hopefully does not annoy facebook, pulling all messages might just crash the entire thing this is why we are doing timely fasion, if we pulled 2 billion messages at once either facebook will be suspicious we are not a browser or the program will freeze of too much throughput (but maybe try straight away since this is a callback in a callback which itself takes some considerable time)
//                   var data_msg = data['messages'], sql = "SET NAMES utf8mb4;";

//                   for (let mk in data_msg)
//                     sql += "INSERT INTO fb_message (threadID, id, type, isGroup, senderID, unread, timestamp, text, reactions, files) VALUES ("+threadID+", '"+ data_msg[mk].id+"', '"+data_msg[mk].type + "', 0, '"+data_msg[mk].senderID+"', "+ ((data_msg[mk].unread)?1:0)+", "+data_msg[mk].timestamp +", " + con.escape((data_msg[mk].text ? data_msg[mk].text.replace(/(['"])/g, "\\$1") : "")) + ", '"+data_msg[mk].reactions +"', " +con.escape((data_msg[mk].files ? data_msg[mk].files.replace(/(['"])/g, "\\$1") : ""))+ ") ON DUPLICATE KEY UPDATE unread="+((data_msg[mk].unread)?1:0) +", reactions='"+ data_msg[mk].reactions + "';";

//                   query(sql, function (res) {
//                     console.log('\x1b[35m%s\x1b[0m', 'Updated 100 FB Messages ('+threadID+') in DB For itteration: ' + iterations + ' From: ' + data.prev)
//                     if(iterations - 1 > 0)
//                         this_function(threadID, fb_user, data.prev, iterations - 1, this_function) //immediately on callback finish ask facebook for more
//                         // setTimeout(function() { this_function(threadID, fb_user, data_msg.prev, iterations - 1, this_function) }, 2000) //every 2 seconds, disturb facebook
//                   })
//                 })
// }



// function fb_update_db_list(fb_user, type) {
//               //anthough this is an expensive function to run, we have to update it every time because facebook relations change, so does names, pictures, profile urls, perhaps birth days if we're in luck, genders if who knows ... 
//               fb_user.list(function(data_users) {
//                 var sql = ""; //fb_users table
//                 var sql2 = ""; //fb_relation table
//                 for (let uk in data_users) {
//                   sql += "INSERT INTO fb_users (userID, name, avatar, type) VALUES ("+data_users[uk].userID+", "+con.escape((data_users[uk].fullName ? data_users[uk].fullName.replace(/(['"])/g, "\\$1") : ""))+ ",'"
//                   +data_users[uk].profilePicture+"', 'facebook') ON DUPLICATE KEY UPDATE name="+con.escape((data_users[uk].fullName ? data_users[uk].fullName.replace(/(['"])/g, "\\$1") : ""))+", avatar='"+data_users[uk].profilePicture+"', gender='"+data_users[uk].gender +"', profile='"+data_users[uk].profileUrl+"', dob="+((data_users[uk].isBirthday) ? 'CURRENT_TIMESTAMP' : '0')+";";
//                   sql2 += "INSERT INTO fb_relation (yourID, theirID, type) VALUES ('"+fb_user.myID+"','"+data_users[uk].userID+"','"+data_users[uk].type+"') ON DUPLICATE KEY UPDATE type='"+data_users[uk].type+"';"
//                 }
//                 // console.log(sql)
//                 query(sql, function(res) {
//                   console.log('\x1b[35m%s\x1b[0m', 'Updated FB Users in DB')
//                 });
//                 // console.log(sql2)
//                 query(sql2, function (res) {
//                   console.log('\x1b[35m%s\x1b[0m', 'Updated FB Relations in DB')
//                 });
//               })

// }

  
  