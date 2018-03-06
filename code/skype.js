"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var skyweb = require("skyweb");

function SkyLogIn(username, password, callback) {
    var skype_web = new skyweb.default();
    skype_web.login(username, password).then(function (skypeAccount) {
        callback(new Skype(skype_web, skypeAccount))
    }).catch(function (reason) {
        console.log(reason);
    })
    
    
}

class Skype {
    constructor(skype_web) {
        this.skyweb = skype_web
        //your info ==> this.skyweb.skypeAccount.selfInfo;
    }
    receive() {
        //recieve message
        this.skyweb.messagesCallback = function(messages) {
            return messages;
            // messages.forEach(function(message) {
            // if (message.resource.from.indexOf(username) === -1 && message.resource.messagetype !== 'Control/Typing' && message.resource.messagetype !== 'Control/ClearTyping')
            //     console.log(message.resource.imdisplayname + ": " + message.resource.content + " (" + message.resource.originalarrivaltime + ")")
            // });
        }
    }
    contacts() {
        return this.skyweb.contactsService.contacts;
    }
    send(person_id, message, file) {    //person_id == conversation_id
        this.skyweb.sendMessage(person_id, message)
        //     // send message here
        //var conversationLink = "https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/" + person_id; //8:life4anime8
        // var conversationLink = message.resource.conversationLink;
        //var conversationId = conversationLink.substring(conversationLink.lastIndexOf('/') + 1)
//     //console.log(">>>>>>>>>>" + conversationId)
    }


}

module.exports = SkyLogIn;
// SkyLogIn("0871716236", "Fuckherhard", function(skype_user) {
//     console.log(skype_user.contacts())
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
