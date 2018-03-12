"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var skyweb = require("skyweb");

function connectS(f, username, password, callback) {
    var skype_web = new skyweb.default();
    skype_web.login(username, password).then(function (skypeAccount) {
        callback(new Skype({f: f, user: username, skype_web: skype_web}))
    }).catch(function (reason) {
        console.log(reason);
    })
    
    
}

class Skype {
    constructor(config) {
        this.skyweb = config.skype_web
        // your info ==> this.skyweb.skypeAccount.selfInfo;
        this.f = config.f
        this.user = config.user
        this.listen()
        this.update()

        //update profiles, relations in DB
        var user = this.user
        var ff = this.f
        var sql = "SET NAMES utf8mb4;"
        var contacts = this.skyweb.contactsService.contacts
        for(let i = 0; i < contacts.length; i++)
            if(contacts[i].type == 'skype' && 'avatar_url' in contacts[i])
                sql += "INSERT INTO relations(yourID, theirID, type, service) VALUES ("+ff.con.escape(user)+","+ff.con.escape(contacts[i].person_id)+",'friend','skype') ON DUPLICATE KEY UPDATE service=service;"+
                       "INSERT INTO profiles (userID, name, avatar, type) VALUES ("+ff.con.escape(contacts[i].person_id)+","+ff.con.escape(contacts[i].display_name)+","+ff.con.escape(contacts[i].avatar_url)+",'skype') ON DUPLICATE KEY UPDATE type=type;"
        ff.query(sql, function(res) { ff.log('Updated DB relations and profiles for Skype [' + user + ']') })

    }
    listen() {
        //recieve message
        var ff = this.f
        var user = this.user
        this.skyweb.messagesCallback = function(messages) {
            messages.forEach(function(message) {
                var conversationLink = message.resource.conversationLink;
                var conversationID = conversationLink.substring(conversationLink.lastIndexOf('/') + 1)
                var conversationFrom = message.resource.from;
                var fromID = conversationFrom.substring(conversationFrom.lastIndexOf('/') + 1)

                if (message.resource.messagetype !== 'Control/Typing' && message.resource.messagetype !== 'Control/ClearTyping')
                    ff.query("INSERT INTO messages(message_owner, service, threadID, id, type, senderID, timestamp, content) VALUES ("+
                    ff.con.escape(user)+",'skype',"+
                    ff.con.escape(conversationID)+","+
                    ff.con.escape(message.resource.id)+","+
                    ff.con.escape((message.resource.messagetype == 'RichText') ? 'text' : 'other')+","+
                    ff.con.escape(fromID)+","+
                    ff.con.escape(message.resource.id)+","+
                    ff.con.escape(message.resource.content) + ")  ON DUPLICATE KEY UPDATE timestamp=timestamp", function(res) {  // console.log(message.resource.imdisplayname + ": " + message.resource.content + " (" +  + ")")
                        ff.log(res.affectedRows + ' row(s) updated [New DB Message Skype]')
                    })
            })
            var message = messages[0];
            ff.query("SELECT userID FROM services WHERE user=" + ff.con.escape(user), function(userIDs) { //support multiquery in this query to insert the message 
                for(let i = 0; i < userIDs.length; i++) {
                  ff.send_if_online(ff.wss, userIDs[i].userID, function(ws) { ws.send(JSON.stringify({message: message})) })
                }
            })
            //for some reason it puts it into a list of one message, don't question skype :)
            // messages.forEach(function(message) {
            // if (message.resource.from.indexOf(username) === -1 && message.resource.messagetype !== 'Control/Typing' && message.resource.messagetype !== 'Control/ClearTyping')
            //     console.log(message.resource.imdisplayname + ": " + message.resource.content + " (" + message.resource.originalarrivaltime + ")")
            // });
        }
    }
    contacts() {
        return this.skyweb.contactsService.contacts;
    }

    update() {
        // var contacts = this.contacts()
        var ff = this.f
        var user = this.user
        ff.query("SELECT userID FROM services WHERE user=" + ff.con.escape(user), function(userIDs) { //support multiquery in this query to insert the message 
            for(let i = 0; i < userIDs.length; i++) {
                ff.send_if_online(ff.wss, userIDs[i].userID, function (ws) {
                    // ff.query("SELECT COUNT(*) as len FROM relations INNER JOIN profiles ON relations.theirID=profiles.userID WHERE yourID=" + ff.con.escape(user) + " AND (SELECT timestamp FROM messages WHERE threadID=relations.theirID ORDER BY timestamp DESC LIMIT 1) IS NOT NULL", function (dtl) {
                    //   if (dtl.length > 0)
                        ff.query("SELECT service, userID, name, avatar, (SELECT timestamp FROM messages WHERE threadID=relations.theirID AND message_owner=yourID ORDER BY timestamp DESC LIMIT 1) as timestamp, (SELECT content FROM messages WHERE threadID=relations.theirID AND message_owner=yourID ORDER BY timestamp DESC LIMIT 1) as text FROM relations INNER JOIN profiles ON relations.theirID=profiles.userID WHERE yourID=" + ff.con.escape(user) + " ORDER BY timestamp DESC", function (contacts) { // LIMIT " + ((parseInt(dtl[0].len) > 10) ? parseInt(dtl[0].len) : 10), function (contacts) {
                            ws.send(JSON.stringify({contacts: contacts}))
                        })
                    // })
                }, 'sent_skype_contacts')
            }
        })
    }

    send(threadID, message, file) {    //person_id == conversation_id
        this.skyweb.sendMessage(threadID, message)
    }

    markAsRead(threadID) {
        this.f.log("Marking Conversation " + threadID + " as Read is not available for this API.", 33) 
        // this.api.markAsRead(threadID)
    }


}

module.exports = connectS;
// SkyLogIn("0871716236", "", function(skype_user) {
//     skype_user.receive(function(message) {
//         if(message.resource.messagetype == 'Control/Typing' || message.resource.messagetype == 'Control/ClearTyping') {
//                 var conversationLink = message.resource.conversationLink;
//                 var threadID = conversationLink.substring(conversationLink.lastIndexOf('/') + 1)
//                 console.log(message.resource.imdisplayname + ' in ' + threadID + ' typing') //message.resource.from
//         }
        

//         if(message.resource.messagetype == 'RichText') {
//             console.log(message.resource.imdisplayname + ": " + message.resource.content + " {" + message.resource.id + "}")
//         }
//         if(message.resource.messagetype !== 'Control/Typing' && message.resource.messagetype !== 'Control/ClearTyping' && message.resource.messagetype !== 'RichText') {
//             console.log(message.resource.imdisplayname + ' sent you a [FILE] {' + message.resource.id + '}')
//         }
//     })
// })




/*
[ {
    id: '0d5d6cff-595d-49d7-9cf8-973173f5233b',
    person_id: '28:0d5d6cff-595d-49d7-9cf8-973173f5233b',
    type: 'agent',
    display_name: 'Skype Translator',
    display_name_source: 'profile',
    agent: { capabilities: [Array],trust: 'not-trusted',type: 'participant',info: [Object] },
    authorized: true,
    blocked: false,
    name: { first: 'Skype Translator', company: 'Microsoft' }
},
{
    id: 'concierge',
    person_id: '28:concierge',
    type: 'agent',
    display_name: 'Skype',
    display_name_source: 'profile',
    agent: { trust: 'not-trusted', type: 'participant', info: [Object] },
    authorized: true,
    blocked: false,
    name: { first: 'Skype', company: 'Skype' } 
},
{ id: 'life4anime8',
    person_id: '8:life4anime8',
    type: 'skype',
    display_name: '٠•●ⓂARIⓃ●•٠',
    display_name_source: 'profile',
    authorized: true,
    auth_certificate: 'AAABBAAAAAFNo7WeJoSmbB0tAn7DJh5xSTdJv0eGfT+jz1DLqCrI38Iph9uponOYNYYx+sGUp9Kvdw73wrqZIfA11vG45cYtz2CxqHK1cKlNeI9ZdwK3YWNn2VBST9jRpguBD1pTdj+CGPVE4eFRR7iDrXpBPJeyg4+LgSyZgEFWgs9++uP7/dr3p/45hIyx9yLyIdlCsWugVSK02A4+dSudIEa2lO9e836V1g6OJVfLl+Wr8Bl5HhhoQ5guh5g59Yuvl+rkn2yCd53FZxv92s0/QpxGZbuxzegHFm/3zsrP5YHDqcIlbtTCqBR5yB54fsAKdmrNBaGov5Zk/51aLAmU2Sjwd/mpGYYyY5WlWe6z0QatByjSBA6EeDTqSP20hu4iuyxKUBNdLLpJbuFUH9+I05UK2LnS5DeR4ksLcERU0u+AZuNjmH+vx+tfHCPGizueAoxeDvQNzaDaGA4bgVUq2yMQ6H/5KB9XVYGxtw7nm1vIDpu3s7c41XuN0ykFdbS4eolH0zE=',
    blocked: false,
    relationship_history: { sources: [Array] },
    avatar_url: 'https://avatar.skype.com/v1/avatars/life4anime8/public',
    locations: [ [Object] ],
    name: { first: '٠•●ⓂARIⓃ●•٠' } },
  { id: 'echo123',
    person_id: '8:echo123',
    type: 'skype',
    display_name: 'Echo / Sound Test Service .',
    display_name_source: 'profile',
    authorized: true,
    blocked: false,
    relationship_history: { sources: [Array] },
    avatar_url: 'https://avatar.skype.com/v1/avatars/echo123/public',
    locations: [ [Object] ],
    name: { first: 'Echo / Sound Test Service', surname: '.' } } ]
*/











//var string = "";
//for(var i = 4; i < process.argv.length; i++)
//    string += process.argv[i] + " ";

// if (!username || !password) {
//     throw new Error('Username and password should be provided as commandline arguments!');
// }
// skyweb.login(username, password).then(function (skypeAccount) {
//     // console.log(skypeAccount)
//     //console.log('Skyweb is initialized now');
//     //console.log('Here is some info about you:' + JSON.stringify(skyweb.skypeAccount.selfInfo, null, 2));
//     //console.log('Your contacts : ' + JSON.stringify(skyweb.contactsService.contacts, null, 2));
//     //console.log('Going incognito.');
//     //skyweb.setStatus('Hidden');


//     // send message here
//     //var conversationLink = "https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/8:life4anime8";

//     // var conversationLink = message.resource.conversationLink;
//     //var conversationId = conversationLink.substring(conversationLink.lastIndexOf('/') + 1)
//     //console.log(">>>>>>>>>>" + conversationId)
//     //skyweb.sendMessage(conversationId, string)

// }).catch(function (reason) {
//     console.log(reason);
// });





///send and receive messages


// //recieve message
// skyweb.messagesCallback = function(messages) {
//     messages.forEach(function(message) {
//         if (message.resource.from.indexOf(username) === -1 && message.resource.messagetype !== 'Control/Typing' && message.resource.messagetype !== 'Control/ClearTyping')
//             console.log(message.resource.imdisplayname + ": " + message.resource.content + " (" + message.resource.originalarrivaltime + ")")

//     });

// }








// //what this is doing is removes listening for errors after 10 of them occuring ... 
// //which is stupid ?? What Spamming errors is worse than NOT SEEING THEM?
// var errorCount = 0;
// var errorListener = function (eventName, error) {
//     console.log(errorCount + " : Error occured : " + error);
//     errorCount++;
//     if (errorCount === 10) {
//         console.log("Removing error listener");
//         skyweb.un('error', errorListener);
//     }
// };
// skyweb.on('error', errorListener);
//# sourceMappingURL=demo.js.map


/*
[ { id: 1009,
    type: 'EventMessage',
    resourceType: 'NewMessage',
    time: '2018-03-06T13:25:02Z',
    resourceLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/8:life4anime8/messages/1520342702155',
    resource: 
     { type: 'Message',
       messagetype: 'Control/Typing',
       originalarrivaltime: '2018-03-06T13:25:02.061Z',
       version: '1520342702155',
       contenttype: 'Application/Message',
       origincontextid: '0',
       isactive: true,
       from: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/contacts/8:life4anime8',
       id: '1520342702155',
       conversationLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/8:life4anime8',
       counterpartymessageid: '1520342702155',
       imdisplayname: 'life4anime8',
       ackrequired: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/ALL/messages/1520342702155/ack',
       composetime: '2018-03-06T13:25:02.061Z' } } ]
[ { id: 1010,
    type: 'EventMessage',
    resourceType: 'NewMessage',
    time: '2018-03-06T13:25:12Z',
    resourceLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/8:life4anime8/messages/1520342712173',
    resource: 
     { type: 'Message',
       messagetype: 'Control/Typing',
       originalarrivaltime: '2018-03-06T13:25:12.070Z',
       version: '1520342712173',
       contenttype: 'Application/Message',
       origincontextid: '0',
       isactive: true,
       from: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/contacts/8:life4anime8',
       id: '1520342712173',
       conversationLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/8:life4anime8',
       counterpartymessageid: '1520342712173',
       imdisplayname: 'life4anime8',
       ackrequired: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/ALL/messages/1520342712173/ack',
       composetime: '2018-03-06T13:25:12.070Z' } } ]
[ 
    
    { id: 1011,
    type: 'EventMessage',
    resourceType: 'NewMessage',
    time: '2018-03-06T13:25:15Z',
    resourceLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/8:life4anime8/messages/1520342715664',
    resource: 
     { clientmessageid: '7726717220239380712',
       type: 'Message',
       messagetype: 'RichText',
       originalarrivaltime: '2018-03-06T13:25:15.525Z',
       version: '1520342715664',
       contenttype: 'text',
       origincontextid: '0',
       isactive: true,
       from: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/contacts/8:life4anime8',
       id: '1520342715664',
       conversationLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/8:life4anime8',
       counterpartymessageid: '1520342715664',
       imdisplayname: '٠•●ⓂARIⓃ●•٠',
       ackrequired: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/ALL/messages/1520342715664/ack',
       content: 'Hello',
       composetime: '2018-03-06T13:25:15.525Z' } } ]


[ { id: 1012,
    type: 'EventMessage',
    resourceType: 'NewMessage',
    time: '2018-03-06T13:25:15Z',
    resourceLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/8:life4anime8/messages/1520342715827',
    resource: 
     { type: 'Message',
       messagetype: 'Control/ClearTyping',
       originalarrivaltime: '2018-03-06T13:25:15.575Z',
       version: '1520342715827',
       contenttype: 'Application/Message',
       origincontextid: '0',
       isactive: true,
       from: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/contacts/8:life4anime8',
       id: '1520342715827',
       conversationLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/8:life4anime8',
       counterpartymessageid: '1520342715827',
       imdisplayname: 'life4anime8',
       ackrequired: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/ALL/messages/1520342715827/ack',
       composetime: '2018-03-06T13:25:15.575Z' } } ]




       [ { id: 1016,
    type: 'EventMessage',
    resourceType: 'NewMessage',
    time: '2018-03-06T13:28:21Z',
    resourceLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/8:life4anime8/messages/1520342901863',
    resource: 
     { clientmessageid: '10372129684207857570',
       type: 'Message',
       messagetype: 'RichText/UriObject',
       originalarrivaltime: '2018-03-06T13:28:20.662Z',
       version: '1520342901863',
       contenttype: 'text',
       origincontextid: '0',
       isactive: true,
       from: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/contacts/8:life4anime8',
       id: '1520342901863',
       conversationLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/8:life4anime8',
       counterpartymessageid: '1520342901863',
       imdisplayname: '٠•●ⓂARIⓃ●•٠',
       ackrequired: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/ALL/messages/1520342901863/ack',
       content: '<URIObject uri="https://api.asm.skype.com/v1/objects/0-neu-d5-549897e8b3664baefec40df448e19abf" url_thumbnail="https://api.asm.skype.com/v1/objects/0-neu-d5-549897e8b3664baefec40df448e19abf/views/imgt1_anim" type="Picture.1" width="1280" height="960">To view this shared photo, go to: <a href="https://login.skype.com/login/sso?go=xmmfallback?pic=0-neu-d5-549897e8b3664baefec40df448e19abf">https://login.skype.com/login/sso?go=xmmfallback?pic=0-neu-d5-549897e8b3664baefec40df448e19abf</a><OriginalName v="73C3D486-C4D4-4BA4-8782-8BBF0F813365.jpg"></OriginalName><FileSize v="613177"></FileSize><meta type="photo" originalName="73C3D486-C4D4-4BA4-8782-8BBF0F813365.jpg"></meta></URIObject>',
       composetime: '2018-03-06T13:28:20.662Z' } } ]




       [ { id: 1017,
    type: 'EventMessage',
    resourceType: 'NewMessage',
    time: '2018-03-06T13:33:12Z',
    resourceLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/8:life4anime8/messages/1520343192317',
    resource: 
     { clientmessageid: '5028520869372471897',
       type: 'Message',
       messagetype: 'RichText/Media_Video',
       originalarrivaltime: '2018-03-06T13:33:08.299Z',
       version: '1520343192317',
       contenttype: 'text',
       origincontextid: '0',
       isactive: true,
       from: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/contacts/8:life4anime8',
       id: '1520343192317',
       conversationLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/8:life4anime8',
       counterpartymessageid: '1520343192317',
       imdisplayname: '٠•●ⓂARIⓃ●•٠',
       ackrequired: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/ALL/messages/1520343192317/ack',
       content: '<URIObject uri="https://api.asm.skype.com/v1/objects/0-neu-d2-51618bfe170b6f69d9b66b3afee4208b" url_thumbnail="https://api.asm.skype.com/v1/objects/0-neu-d2-51618bfe170b6f69d9b66b3afee4208b/views/thumbnail" type="Video.1/Message.1" width="360" height="640">To view this video message, go to: <a href="https://login.skype.com/login/sso?go=xmmfallback?vim=0-neu-d2-51618bfe170b6f69d9b66b3afee4208b">https://login.skype.com/login/sso?go=xmmfallback?vim=0-neu-d2-51618bfe170b6f69d9b66b3afee4208b</a><OriginalName v="videoMessageRecording-604E4905-AD10-4EB5-9AEC-197596431CA2.mp4"></OriginalName><FileSize v="0"></FileSize></URIObject>',
       composetime: '2018-03-06T13:33:08.299Z' } } ]






















       { id: 1024,
  type: 'EventMessage',
  resourceType: 'NewMessage',
  time: '2018-03-06T14:24:51Z',
  resourceLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/19:4872c37cf5e243fb9656a90ef7a178e1@thread.skype/messages/1520346291628',
  resource: 
   { threadtopic: 'Yoyo',
     messagetype: 'Control/Typing',
     originalarrivaltime: '2018-03-06T14:24:51.506Z',
     type: 'Message',
     version: '1520346291628',
     contenttype: 'Application/Message',
     origincontextid: '0',
     isactive: true,
     from: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/contacts/8:life4anime8',
     id: '1520346291628',
     conversationLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/19:4872c37cf5e243fb9656a90ef7a178e1@thread.skype',
     counterpartymessageid: '1520346291628',
     imdisplayname: 'life4anime8',
     ackrequired: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/ALL/messages/1520346291628/ack',
     composetime: '2018-03-06T14:24:51.506Z' } }
{ id: 1025,
  type: 'EventMessage',
  resourceType: 'NewMessage',
  time: '2018-03-06T14:24:53Z',
  resourceLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/19:4872c37cf5e243fb9656a90ef7a178e1@thread.skype/messages/1520346293362',
  resource: 
   { isactive: true,
     threadtopic: 'Yoyo',
     messagetype: 'RichText',
     conversationLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/19:4872c37cf5e243fb9656a90ef7a178e1@thread.skype',
     origincontextid: '0',
     contenttype: 'text',
     originalarrivaltime: '2018-03-06T14:24:53.207Z',
     from: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/contacts/8:life4anime8',
     content: 'Heyo',
     imdisplayname: '٠•●ⓂARIⓃ●•٠',
     counterpartymessageid: '1520346293362',
     id: '1520346293362',
     ackrequired: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/ALL/messages/1520346293362/ack',
     version: '1520346293362',
     type: 'Message',
     clientmessageid: '3274870610718861528',
     composetime: '2018-03-06T14:24:53.207Z' } }
{ id: 1026,
  type: 'EventMessage',
  resourceType: 'NewMessage',
  time: '2018-03-06T14:24:53Z',
  resourceLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/19:4872c37cf5e243fb9656a90ef7a178e1@thread.skype/messages/1520346293643',
  resource: 
   { threadtopic: 'Yoyo',
     messagetype: 'Control/ClearTyping',
     originalarrivaltime: '2018-03-06T14:24:53.256Z',
     type: 'Message',
     version: '1520346293643',
     contenttype: 'Application/Message',
     origincontextid: '0',
     isactive: true,
     from: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/contacts/8:life4anime8',
     id: '1520346293643',
     conversationLink: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/19:4872c37cf5e243fb9656a90ef7a178e1@thread.skype',
     counterpartymessageid: '1520346293643',
     imdisplayname: 'life4anime8',
     ackrequired: 'https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/ALL/messages/1520346293643/ack',
     composetime: '2018-03-06T14:24:53.256Z' } }

*/