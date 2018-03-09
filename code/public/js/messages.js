function getContactById(contactID) {
    for(let i = 0; i < page.contacts.length; i++)
        if(page.contacts[i].userID == contactID)
            return page.contacts[i]
}

function handle_message(message) {

    var contactID, fromID, conversationLink, conversationFrom, message_type, timestamp, content, fromName
    //var msg_html = document.getElementById('messages')
    if('resource' in message) { //it's a skype message
        fromID = message.resource.from.substring(message.resource.from.lastIndexOf('/') + 1)
        fromName = message.resource.imdisplayname
        message_type = message.resource.messagetype == 'RichText' ? 'text' : 'other'
        if(message.resource.messagetype == 'Control/Typing')
            M.toast({ html: "<img src='https://i.imgur.com/edQkxse.png' style='width:29px; height:29px'>("+fromName+") Typing ...", classes: 'blue' })
        if(message.resource.messagetype == 'Control/ClearTyping')
            M.toast({ html: "<img src='https://i.imgur.com/edQkxse.png' style='width:29px; height:29px'>("+fromName+") Clearing ...", classes: 'blue' })
        if(message.resource.messagetype !== 'Control/Typing'  && message.resource.messagetype !== 'Control/ClearTyping') {
        var msg = {
                "id":1108,
                "type":"EventMessage",
                "resourceType":"NewMessage",
                "time":"2018-03-09T13:55:00Z",
                "resourceLink":"https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/8:live:20a002c57bc1f838/messages/1520603700830",
                "resource":{
                    "clientmessageid":"17555921056000866618",
                    "type":"Message",
                    "messagetype":"RichText",
                    "originalarrivaltime":"2018-03-09T13:54:59.360Z",
                    "version":"1520603700830",
                    "contenttype":"text",
                    "origincontextid":"0",
                    "isactive":true,
                    "from":"https://db4-client-s.gateway.messenger.live.com/v1/users/ME/contacts/8:live:20a002c57bc1f838",
                    "id":"1520603700830",
                    "conversationLink":"https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/8:live:20a002c57bc1f838",
                    "counterpartymessageid":"1520603700830",
                    "imdisplayname":"hasan fakhra",
                    "ackrequired":"https://db4-client-s.gateway.messenger.live.com/v1/users/ME/conversations/ALL/messages/1520603700830/ack",
                    "content":"ya i got ",
                    "composetime":"2018-03-09T13:54:59.360Z"
                }
            }

            //    page.contacts
            //    page.groups
            //    page.inMessage
            //        page.participants
            //        page.fromGroupinMessage
            //        page.talkingTo
            //        page.talkingToService
            //        page.talkingToName

            if(page.inMessage) {
                if('skype' in page.participants)
                    for(let i = 0; i < page.participants.skype.length; i++)
                        if(page.participants.skype[i].userID == fromID)
                            addMessage({service: 'skype', type: message_type, from: fromID, avatar: page.participants.skype[i].avatar,
                                 isMe: false, content: message.resource.content, name:page.participants.skype[i].name, timestamp: message.resource.id})
            } else {
                //let contact = getContactById(fromID)
                M.toast({ html: "<img src='https://i.imgur.com/drtemjh.png' style='width:32px;height:32px'>"+
                    fromName+"<br>" + (message_type == 'text' ? message.resource.content : '[FILE]') + "<img src='https://i.imgur.com/edQkxse.png' style='width:29px; height:29px'>", classes: 'blue' })
            }
        }
        
    } else { //it can only be facebook (bad habbit if we want more api in the future)
        //{"isTyping":true,"from":"778695889","threadID":"100013582237495","fromMobile":true,"userID":"778695889","type":"typ"}
        //{"type":"message","senderID":"778695889","body":"Dhxh","threadID":"778695889","messageID":"mid.$cAABa9hRjS-ZoPHwU4FiCzbMkAGdw","attachments":[],"timestamp":"1520606563552","isGroup":false}
        var contact
        if('senderID' in message)
            contact = getContactById(message.senderID)
        if('from' in message)
            contact = getContactById(message.from)

        if('isTyping' in message && contact) {
            M.toast({ html: "<img src='"+contact.avatar+"' style='width:32px;height:32px' class='circle photo'>"+
                    contact.name +"<br> Typing ... <img src='https://i.imgur.com/bOl3IOa.png' style='width:29px; height:29px'>", classes: 'blue' })
        }
        else if('body' in message) {
            if(page.inMessage) {
                if('facebook' in page.participants)
                    for(let i = 0; i < page.participants.facebook.length; i++)
                        if(page.participants.facebook[i].userID == message.senderID)
                            addMessage({service: 'facebook', type: ((message.body && message.body.length > 0) ? 'text' : 'other'),
                                 from: message.senderID, avatar: page.participants.skype[i].avatar,
                isMe: false, content: message.resource.content, name:page.participants.skype[i].name, timestamp: message.resource.id})
            } else {
                M.toast({ html: "<img src='"+contact.avatar+"' style='width:32px;height:32px' class='circle photo'>"+
                contact.name +"<br> "+message.body+" <img src='https://i.imgur.com/bOl3IOa.png' style='width:29px; height:29px'>", classes: 'blue' })
            
            }
            
        } else {
            console.log(JSON.stringify(message))
        }

    }
        // else {
        //     console.log(message)
        //     if(!page.inMessage) {
        //         //modify users and groups last message, make text bold, prioritise, add a number counter of unread messages
        //     } else {
        //         //we are in a message,
        //         //get notification if the message we are in is not related to the one we get notified from

        //         //otherwise add it to document.getElementById('messages').innerHTML
        //     }

        //     //users and groups have messages object attatched, and another attrubute which defines if already pulled from server
        //     //which means that if we are in a message
        // }
        // conversationLink = message.resource.conversationLink;
        // contactID = conversationLink.substring(conversationLink.lastIndexOf('/') + 1)
        // conversationFrom = message.resource.from;
        // fromID = conversationFrom.substring(conversationFrom.lastIndexOf('/') + 1)    
        // message_type = message.resource.messagetype == 'RichText' ? 'text' : 'other'
        // timestamp = message.resource.id
        // content = message.resource.content
        // if(message.resource.messagetype !== 'Control/Typing'  && message.resource.messagetype !== 'Control/ClearTyping')
        // console.log("Message [TEXT] OR [FILE] received...")

  
    
    //fb_threads
    //find contacts and update the contact, recommended list of contcts swap the zzero element with the one that sent the message for 
    //loop for through all te contacts find person who sent the message put message to the contact text field bold put it first
    
  
  
    // if (ws) ws.send(JSON.stringify({ get_message: this.getAttribute('title'), service_name: this.getAttribute('alt'), token: getCookie("wss") }))
    //  page.talkingTo = 'title'
    //  page.talkingToService = this.getAttribute('alt')
    //  document.getElementById('threadName').innerHTML = page.talkingToName
    
    //
    //   var conversationLink = message.resource.conversationLink;
    //   var contactID = conversationLink.substring(conversationLink.lastIndexOf('/') + 1)
    // var conversationFrom = message.resource.from;
    // var fromID = conversationFrom.substring(conversationFrom.lastIndexOf('/') + 1)
  
    // if (message.resource.messagetype !== 'Control/Typing' && message.resource.messagetype !== 'Control/ClearTyping')
    //     })
  
  
    //} //contqact[0].text make it bold
    
    //   var contact = page.contact  
    //   var tmp_contact,msg_con
    //   for(let i = 0; i < page.contacts.length;i++){
        
    //     if(contact[i].userID == contactID || contact[i].userID == message.userID){
          
    //     tmp_contact = contact[i]
    //     contact[i] = contact[0]
    //     contact[0] = tmp_contact
        
    //      msg_con = contact[i].text
    //     }
        
        
    //     console.log(msg_con)
        
    //      //document.getElementById('message').innerHTML
        
    //     // page.list_contact = true
        
    //   }
    //console.log(message)
    // M.toast({ html: JSON.stringify(message), classes: 'black' })
  }


//   function handle_messages(msgs) {
//     // document.getElementById('messages').innerHTML = msgs;
//     for (let i = msgs.length - 1; i > -1; i--) {
//       document.getElementById('messages').innerHTML += '<div class="date">' + new Date(parseInt(msgs[i].timestamp)).toUTCString() + '</div>';
//       document.getElementById('messages').innerHTML += '<div class="' + ((msgs[i].senderID == page.talkingTo) ? 'from-them' : 'from-me') + '">' + msgs[i].content + '</div><div class="clear"></div>'; //<img src="images/femaleblonde.jpg" alt="name" class="circle photo">
  
//       //scroll bottom
//       document.getElementById("messages").scrollTo(0, document.getElementById("messages").scrollHeight)
//     }
//   }

//   function userTying(data) {
      
//     // console.log(data)
//     if (page.talkingTo == data.from) {
//       if (!data.isTying && !page.typer) {
//         document.getElementById('messages').innerHTML += '<div class="from-them" id="typing_' + data.from + '"><img src="https://gifimage.net/wp-content/uploads/2017/11/facebook-typing-gif-4.gif" style="width:100px;height:40px"/></div>'; //<img src="images/femaleblonde.jpg" alt="name" class="circle photo">
//         document.getElementById("messages").scrollTo(0, document.getElementById("messages").scrollHeight)
//       } else {
//         // if(document.getElementById('typing_'+data.from))
//         document.getElementById('typing_' + data.from).remove()
//       }
//       page.typer = !page.typer;
//     }
//   }


  //send_text_message on pressing enter
function keysPress(textarea) {
    var key = window.event.keyCode;
    if (key === 13 && ws && page.inMessage) { // If the user has pressed enter
      send_message_to_server()
      return false;
    }
    else if (page.inMessage && textarea.value.length > 0 && ws && parseInt((new Date() - page.isTyping) / 1000) > 30) {
      ws.send(JSON.stringify({sendTypingIndicator: page.talkingTo, token: getCookie("wss"), service: page.talkingToService }))
      page.isTyping = new Date()
    }
    else return true;
  }


function send_message_to_server() {
    var message_box = document.getElementById('message_textbox')
    if(message_box.value.trim().length > 0) {
        ws.send(JSON.stringify({ sendMessage: message_box.value, toUser: page.talkingTo, token: getCookie("wss"), service: page.talkingToService }))
        document.getElementById("messages").scrollTo(0, document.getElementById("messages").scrollHeight)
        message_box.value = ''
    } else M.toast({ html: 'Please type in a message first ...', classes: 'black' })
}


/** USAGE addMessage({type: 'text', from: 'Marin', isMe: false, content: 'Text Message' avatar: 'https://i.imgur.com/drtemjh.png'})
 * this adds text message to messages, nicely formatting it all
 */

function addMessage(config) {
    var service = config.service || 'facebook'
    var type = config.type || 'text'
    var from = config.from || 'user'
    var avatar = config.avatar || 'https://i.imgur.com/27HbgjG.jpg' //https://i.imgur.com/drtemjh.png
    var isMe = config.isMe || false
    var content = config.content || '...'
    var timestamp = config.timestamp || new Date()/1000
    var name = config.name || 'Anonymous'

    document.getElementById('messages').innerHTML += '<div class="date">' + new Date(parseInt(timestamp)).toUTCString() + '</div>';

    document.getElementById('messages').innerHTML += '<div class="'+(isMe? 'from-me' : 'from-them')+'">'+
    (service == 'skype' ? '<img src="https://i.imgur.com/edQkxse.png" style="width:29px; height:29px">' : 
    '<img src="https://i.imgur.com/bOl3IOa.png"  style="width:29px; height:29px">')+
    (!isMe ? '<img src="'+avatar+'" alt="'+name+'" title="'+name+'" class="circle photo" style="width:29px;height:29px">' : '')+
    (type == 'text' ? content : '<div class="card" style="filter:blur(8px)">[FILE]</div>') + '</div><div class="clear"></div>';
}



function list_messages(messages) {
    for(let i = messages.length - 1; i >= 0; i--) { //message_owner, avatar, name, messages.service threadID, id, messages.type, senderID, timestamp, content 
        addMessage({type: messages[i].type, from: messages[i].senderID, avatar: messages[i].avatar,
                isMe: messages[i].threadID != messages[i].senderID, //THAT's WRONG!!! Fix IT!
                content: messages[i].content, service: messages[i].service, timestamp: messages[i].timestamp, name: messages[i].name })
    }
    document.getElementById("messages").scrollTo(0, document.getElementById("messages").scrollHeight)
    //add messages local copy
    for (let i = 0; i < page.groups.length; i++)
        if(parseInt(page.groups[i].groupID) == parseInt(page.talkingTo))
            page.groups[i].messages = messages


    if(page.fromGroupinMessage) {

        var data = []
        var uid, found
        for(let i = 0; i < messages.length; i++) {
            uid = messages[i].service + ',' + messages[i].senderID + ','  + messages[i].avatar + ',' + messages[i].name
            found = false
            for(let j = 0; j < data.length; j++)
                if(data[j] == uid || messages[i].senderID != messages[i].threadID)
                   found = true
            if(!found) data.push(uid)

        }

        var participants = {}, user
        for(let i = 0; i < data.length; i++) {
            user = data[i].split(',')
            if(user[0] in participants) participants[user[0]].push({userID: user[1], avatar: user[2], name: user.slice(3).join()})
            else participants[user[0]] = [{userID: user[1], avatar: user[2], name: user.slice(3).join()}]
        }

        page.participants = participants
        //get messages layout for a group
        document.getElementById('message_container').style.left = '280px';
        updateSelectors()
    }
}

function updateSender(data) {
    page.talkingToService = data.split(',')[0]
    page.talkingTo = data.split(',').slice(1).join()
}
function updateSelectors(select) {
    var selected = 'facebook'
    if(select)
        selected = select.value

    var selectors = "<select class='feature1 btn waves-effect waves-light' style='width:125px; opacity:1;pointer-events: all;' onchange='updateSelectors(this)'>"
    if(selected == 'facebook') {
        if('facebook' in page.participants)
            selectors += "<option value='facebook'>Facebook</option>"
        if('skype' in page.participants)
            selectors += "<option value='skype'>Skype</option>"
    } else {
        if('skype' in page.participants)
            selectors += "<option value='skype'>Skype</option>"
        if('facebook' in page.participants)
            selectors += "<option value='facebook'>Facebook</option>"
    }
        
    selectors += "</select><select class='feature2 btn waves-effect waves-light' style='width:148px; opacity:1;pointer-events: all;' onchange='updateSender(this.value, \""+selected+"\")'>"
    if(page.participants[selected].length > 0)
        updateSender(selected + "," +page.participants[selected][0].userID)

    for(let i = 0; i < page.participants[selected].length; i++)
        selectors += "<option value='"+selected+ "," +page.participants[selected][i].userID+"'>@ "+page.participants[selected][i].name+"</option>"
    selectors += "</select>"
    document.getElementById('option_selectors').innerHTML = selectors

}