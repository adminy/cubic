process.title = "Cubik"
//sometimes we have to check if our string is a json object
//this was the quick way of finding out without having try/except everywhere
function isJSON(s) { try { JSON.parse(s); } catch (e) { return false; } return true; }

function send_if_online(wss, userID, callback, prevent_ws_further) {    //prevent_ws_further is a secret name that is given to a client only once!
    wss.clients.forEach(function each(client) {
        if (client.userID && client.userID == userID && client.readyState === WebSocket.OPEN && !(prevent_ws_further in client)) {
            // client.send(JSON.stringify(data))  //data must be stringified beforehand or in here
            if (prevent_ws_further)
                client[prevent_ws_further] = true;
            callback(client)
        }
    })
}

//ALL GLOBAL VARIABLES, IMPORTS
var express = require('express')(),
    https = require('https'), //var http = require('http');
    fs = require('fs'),
    WebSocket = require('ws'),
    // query = require('./sql'),
    crypto = require("crypto"),
    appPort = process.env.PORT,
    args = process.argv.slice(2),
    messenger_api = null,
    msg = null,
    connectFB = require('./fb'),
    connectS = require('./skype'),
    load_services = require('./load_services'),
    services = [],
    register_service = require('./reg_service')
    load_routes = require('./routes'),
    log = require('./log'),
    auth = require('./auth'), //login/register
    check_token = require('./check_token'),  //do we already know you?  
    when_client_disconnects = require('./client_disconnected'),
    on_exit = require('./app_exit'),
    ssl = {
        key: fs.readFileSync('/etc/letsencrypt/live/ie.dyndns.biz/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/ie.dyndns.biz/cert.pem')
    }
//DB ----------------------------------------------------------------------------------------------------------------
var mysql = require('mysql'),
    db = { host: 'sql32.main-hosting.eu', user: 'u894154994_cubik', password: 'password', port: 3306, database: 'u894154994_cubik', charset: 'utf8mb4', multipleStatements: true },
    con = mysql.createConnection(db); //keep this public so it can be accessed by `con.escape()`
/** -- This is a shortcut function which evades typing out every time all of that, only abstract the important bits, `make a query`
 * @param {string} sql - any sql query [CREATE, DROP, SELECT, INSERT, UPDATE, DELETE] 
 * @param {*} callback - function which takes the result and fields
 */
function query(sql, callback) {
    con.query(sql, function (err, data, fields) {
        if (err) throw console.error(err);
        callback(data, fields)
    })
    con.end(); //make a new one for each query
    con = mysql.createConnection(db);
    con.on('error', function (err) { log(err.code, 31) })
}
//DB -----------------------------------------------------------------------------------------------------------------

var server = https.createServer(ssl, express)
server.listen(443) //at HTTPS port, serve the express server

var wss = new WebSocket.Server({ server: server })
wss.on('connection', function connection(ws, req) {
    ws.on('message', function incoming(message) {
        if (isJSON(message)) {
            let data = JSON.parse(message)
            //different client requests in message format 
            if ('token' in data && Object.keys(data).length == 1)
                check_token(data.token, ws, con, query, log)

            if ('google_id' in data || 'facebook_id' in data)
                auth(data, ws, crypto, query, con, log)

            if ('token' in data && 'user' in data && 'pass' in data && 'service_name' in data)
                register_service(data, ws, con, query, log)

            if ('my_services' in data)
                query("SELECT id AS userID, name, avatar, service, user FROM users JOIN services ON users.id = services.userID JOIN devices ON devices.userID=users.id WHERE token=" +
                    con.escape(data.my_services) + " GROUP BY user, service", function (res) {
                        ws.send(JSON.stringify({ my_services: res }))
                        query("SELECT groupID, name, services, avatar, creation_timestamp FROM groups_info JOIN devices ON devices.userID = groups_info.owner WHERE token="+ con.escape(data.my_services), function(groups) {
                            if(groups.length > 0)
                                ws.send(JSON.stringify({groups: groups}))
                        })
                    })


            //{ sendMessage: textarea.value, toUser: page.talkingTo, token: getCookie("wss"), service: page.talkingToService })) 
            if ('sendMessage' in data && 'toUser' in data && 'token' in data && 'service' in data)
                query("SELECT user FROM services JOIN devices ON services.userID = devices.userID WHERE service=" + con.escape(data.service) + " AND token=" +
                    con.escape(data.token), function (users) {
                        for (let i = 0; i < services.length; i++)
                            if (services[i].user == users[0].user)
                                services[i].send(data.toUser, data.sendMessage)
                    })
            //first query determines if you have at least 10 people in this app which you tried talking to, if not it'll show you 10 random people, else it will show you all the ones you did talk with
            //now the beauty is that we have a listener, so even if you're new to the app, if you have friends who talk to you, the app will sort those people as we register to what we listen for better notifications system. of course we know it's a little outdated but it works and It took a lot to get it at least to this state, with future improvements perhaps the new feature will be implemented


            if('get_user_messages' in data && 'service_name' in data && 'token' in data) {
                query("SELECT message_owner, avatar, name, messages.service, threadID, id, messages.type, senderID, timestamp, content FROM messages "+
                "JOIN services ON messages.message_owner=services.user AND messages.service=services.service "+
                "JOIN devices ON services.userID = devices.userID "+
                "JOIN profiles ON profiles.userID = messages.threadID "+
                "WHERE messages.service="+con.escape(data.service_name)+
                " AND threadID="+con.escape(data.get_user_messages)+" AND token="+con.escape(data.token) +
                " ORDER BY timestamp DESC LIMIT 50", function (messages) {
                    ws.send(JSON.stringify({messages: messages}))
                })
                
            }
            
            if('createGroup' in data && 'token' in data && 'name' in data && 'services' in data) {
                if(data.createGroup && data.createGroup.length > 1) {
                    //Insert Group to MySQL
                    query("SELECT userID FROM devices WHERE token=" + con.escape(data.token), function(res) {
                        if(res.length > 0)
                            query("INSERT INTO groups_info(name, services, owner, avatar) VALUES ("+con.escape(data.name) + ","+ con.escape(data.services) +","+ con.escape(res[0].userID) +",'https://i.imgur.com/gKCrzGD.png') ON DUPLICATE KEY UPDATE avatar=avatar", function(res) {
                                if(ws)
                                  if(res.affectedRows > 0) {
                                    ws.send(JSON.stringify({'group_successfully_created': {name: data.name, avatar: 'https://i.imgur.com/gKCrzGD.png', groupID: res.insertId, services: data.services}}))
                                    var sql = ""
                                    for(let i = 0; i < data.createGroup.length; i++)
                                        sql += "INSERT INTO groups(groupID, userID, service) VALUES ("+con.escape(res.insertId)+", "+con.escape(data.createGroup[i].userID)+", "+con.escape(data.createGroup[i].service)+");"
                                    query(sql, function() { log('Added Users to Group', 32) })
                                  }
                                  else
                                    ws.send(JSON.stringify({'group_creation_failed': 'group_already_exists'}))
                              
                              //log(res.affectedRows + ' row(s) Updated Created ')  
                            })

                    })
                    // log(JSON.stringify(data), 35)
                } else {
                    ws.send(JSON.stringify({'group_creation_failed': 'not_enough_users_to_make_a_group'}))
                    log('Attempted to make a group and failed injected! Our client side should not have allowed that!', 31)
                }
            }
            
            if('destroyGroup' in data && 'token' in data)
                query("SELECT userID FROM devices WHERE token=" + con.escape(data.token), function(res) {
                    if(res.length > 0)  {
                        var sql = ""
                        for(let i = 0; i < data.destroyGroup.length; i++)
                            sql += "DELETE FROM groups_info WHERE groupID="+con.escape(data.destroyGroup[i].groupID) + " AND owner=" + con.escape(res[0].userID) + ";"+
                                   "DELETE FROM groups WHERE groupID="+con.escape(data.destroyGroup[i].groupID) + ";"
                        query(sql, function() { log('Deleted Group(s) Successfully By UserID: ' + res[0].userID, 32) })
                    }
                })

            if('get_group_messages' in data) {
                // console.log(JSON.stringify(data))
                // {"get_group_messages":"2","services":"facebook,skype","token":"e4e68a1bc5f650f63d339ec811496ce1d598389e7ebdeb66073e961b8155f76f"}
                query("SELECT userID, service FROM groups WHERE groupID="+ con.escape(data.get_group_messages), function(users) {
                    if(users.length > 0)  {
                        var sql = "SELECT message_owner, avatar, name, messages.service, threadID, id, messages.type, senderID, timestamp, content FROM messages "+
                                  "JOIN services ON messages.message_owner=services.user AND messages.service=services.service "+
                                  "JOIN devices ON services.userID = devices.userID JOIN profiles ON profiles.userID = messages.threadID WHERE token="+con.escape(data.token)+
                                  " AND ((messages.service="+con.escape(users[0].service)+ " AND threadID="+con.escape(users[0].userID)+") "

                        for(let i = 1; i < users.length; i++) 
                            sql += "OR (messages.service="+con.escape(users[i].service)+" AND threadID="+con.escape(users[i].userID)+") "
                        sql += ") ORDER BY timestamp DESC LIMIT 50"
                        query(sql, function (messages) { ws.send(JSON.stringify({messages: messages})) })
                    }
                })
                
            }
            
            if('sendTypingIndicator' in data && 'token' in data && 'service' in data)
                query("SELECT user FROM services JOIN devices ON services.userID = devices.userID WHERE service=" + con.escape(data.service) + " AND token=" +
                con.escape(data.token), function (users) {
                    for (let i = 0; i < services.length; i++)
                        if (services[i].user == users[0].user)
                            services[i].markAsRead(data.sendTypingIndicator)
                })

            //undefined request, what is it?
            if (!('token' in data || 'google_id' in data || 'facebook_id' in data || 'my_services' in data || 'fb_threads' in data))
                log(JSON.stringify(data), 31)
        }
        log('Websocket User Connected', 32)

        for (let i = 0; i < services.length; i++) services[i].update()
        when_client_disconnects(ws, log)

    })

})

load_services({ services: services, connectFB: connectFB, connectS: connectS, con: con, query: query, wss: wss, fs: fs, log: log, isJSON: isJSON, send_if_online: send_if_online })
load_routes(express)
on_exit(log)