function handle_message(message) {
    var contactID
    if('resource' in message) { //it's a skype message
    var conversationLink = message.resource.conversationLink;
    contactID = conversationLink.substring(conversationLink.lastIndexOf('/') + 1)
    var conversationFrom = message.resource.from;
    var fromID = conversationFrom.substring(conversationFrom.lastIndexOf('/') + 1)
    
    
  
  
    //fb_threads
    //find contacts and update the contact, recommended list of contcts swap the zzero element with the one that sent the message for 
    //loop for through all te contacts find person who sent the message put message to the contact text field bold put it first
    
  
    // var get_message = document.getElementById('messages')
  
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
    //     ff.query("INSERT INTO messages(message_owner, service, threadID, id, type, senderID, timestamp, content) VALUES ("+
    //     ff.con.escape(user)+",'skype',"+
    //     ff.con.escape(conversationID)+","+
    //     ff.con.escape(message.resource.id)+","+
    //     ff.con.escape((message.resource.messagetype == 'RichText') ? 'text' : 'other')+","+
    //     ff.con.escape(fromID)+","+
    //     ff.con.escape(message.resource.id)+","+
    //     ff.con.escape(message.resource.content) + ")  ON DUPLICATE KEY UPDATE timestamp=timestamp", function(res) {  // console.log(message.resource.imdisplayname + ": " + message.resource.content + " (" +  + ")")
    //         ff.log(res.affectedRows + ' row(s) updated [New DB Message Skype]')
    //     })
  
  
    } //contqact[0].text make it bold
    
      var contact = page.contact  
      var tmp_contact,msg_con
      for(let i = 0; i < page.contacts.length;i++){
        
        if(contact[i].userID == contactID || contact[i].userID == message.userID){
          
        tmp_contact = contact[i]
        contact[i] = contact[0]
        contact[0] = tmp_contact
        
         msg_con = contact[i].text
        }
        
        
        console.log(msg_con)
        
         //document.getElementById('message').innerHTML
        
        // page.list_contact = true
        
      }
    //console.log(message)
    M.toast({ html: JSON.stringify(message), classes: 'black' })
  }


  function handle_messages(msgs) {
    // document.getElementById('messages').innerHTML = msgs;
    for (let i = msgs.length - 1; i > -1; i--) {
      document.getElementById('messages').innerHTML += '<div class="date">' + new Date(parseInt(msgs[i].timestamp)).toUTCString() + '</div>';
      document.getElementById('messages').innerHTML += '<div class="' + ((msgs[i].senderID == page.talkingTo) ? 'from-them' : 'from-me') + '">' + msgs[i].content + '</div><div class="clear"></div>'; //<img src="images/femaleblonde.jpg" alt="name" class="circle photo">
  
      //scroll bottom
      document.getElementById("messages").scrollTo(0, document.getElementById("messages").scrollHeight)
    }
  }

  function userTying(data) {
      
    // console.log(data)
    if (page.talkingTo == data.from) {
      if (!data.isTying && !page.typer) {
        document.getElementById('messages').innerHTML += '<div class="from-them" id="typing_' + data.from + '"><img src="https://gifimage.net/wp-content/uploads/2017/11/facebook-typing-gif-4.gif" style="width:100px;height:40px"/></div>'; //<img src="images/femaleblonde.jpg" alt="name" class="circle photo">
        document.getElementById("messages").scrollTo(0, document.getElementById("messages").scrollHeight)
      } else {
        // if(document.getElementById('typing_'+data.from))
        document.getElementById('typing_' + data.from).remove()
      }
      page.typer = !page.typer;
    }
  }


  //send_text_message on pressing enter
function keysPress(textarea) {
    var key = window.event.keyCode;
    if (key === 13 && ws && page.inMessage) { // If the user has pressed enter
      ws.send(JSON.stringify({ sendMessage: textarea.value, toUser: page.talkingTo, token: getCookie("wss"), service: page.talkingToService }))
      document.getElementById('messages').innerHTML += '<div class="from-me">' + textarea.value + '</div><div class="clear"></div>';
      document.getElementById("messages").scrollTo(0, document.getElementById("messages").scrollHeight)
      textarea.value = ''
      return false;
    }
    else if (page.inMessage && textarea.value.length > 0 && ws && parseInt((new Date() - page.isTyping) / 1000) > 30) {
      ws.send(JSON.stringify({ sendTypingIndicator: page.talkingTo, token: getCookie("wss") }))
      page.isTyping = new Date()
    }
    else return true;
  }