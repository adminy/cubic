var ws, connected = false, users, delet = false, page = { atLogin: false, LoggedIn: false, isTyping: new Date(), contacts: [], groups: [], selectedContacts: [], selectedGroups: [] }
page.isTyping.setSeconds(page.isTyping.getSeconds() - 30) //to tell the user is typing immediately

function menu_to_message() {
    var items = document.getElementsByClassName('list_item');
    for (var i = 0; i < items.length; i++) {
      items[i].onclick = function (event) {
        if(page.makeGroup || page.breakGroup) {
            if(this.getAttribute('data') == "contact") selectedContact(this)
            else selectedGroup(this)
        } else { //you are going to what you clicked thread
          page.inMessage = true
          if (ws) ws.send(JSON.stringify({ get_user_messages: this.getAttribute('title'), service_name: this.getAttribute('alt'), token: getCookie("wss") }))
          page.talkingTo = this.getAttribute('title') //set who you are going to talk to in the messages page
          page.talkingToService = this.getAttribute('alt')
          page.talkingToName = this.getAttribute('name')
          let msgdiv = document.getElementById('msgdiv')
          removeClass(msgdiv, "unloader")
          addClass(msgdiv, "loader")
          document.getElementById('msgdiv').style.display = 'block';
          document.getElementById('threadName').innerHTML = page.talkingToName
        }
      }
    }
  }

var top_bar_content = '<b>\
      <span style="color: black; font-size:30px;">Cubik</span>\
    </b>\
    <div class="nav-wrapper white container collection-item right" style="position:absolute;top:0;right:0;width:auto;padding:0;text-align:center;">\
      <button class="waves-effect modal-trigger waves-light dropdown-button blue-text text-darken-2 meniu" onclick="show_menu()">\
        <i class="material-icons right">more_vert</i>\
      </button>\
    </div>'

function cancelActions() {
    document.getElementById("top_bar").innerHTML = top_bar_content
    if(page.makeGroup)
      delete page.makeGroup
    if(page.breakGroup)
      delete page.breakGroup
}

function selectedContact(item) { //has to be a contact item when making a group
    if(page.makeGroup) {
        var alreadyExists = false,
        newSelected = []
        for(let i = 0; i < page.selectedContacts.length; i++)
            if(page.selectedContacts[i].userID == item.getAttribute('title')) {
              item.removeAttribute('style')
              alreadyExists = true
            } else newSelected.push(page.selectedContacts[i])
        page.selectedContacts = newSelected
        if(!alreadyExists) {
          item.setAttribute('style', 'background:yellow')
          page.selectedContacts.push({userID: item.getAttribute('title'), service: item.getAttribute('alt'), name: item.getAttribute('name')})
        }
    }
}

function selectedGroup(item) { //has to be a group item that can be deleted
    if(page.breakGroup) {
        var alreadyExists = false,
            newSelected = []
        for(let i = 0; i < page.selectedGroups.length; i++)
            if(page.selectedGroups[i].groupID == item.getAttribute('title')) {
                item.removeAttribute('style')
                alreadyExists = true
            } else newSelected.push(page.selectedGroups[i])
        page.selectedGroups = newSelected
        if(!alreadyExists) {
            item.setAttribute('style', 'background:yellow')
            page.selectedGroups.push({groupID: item.getAttribute('title'), service: item.getAttribute('alt'), name: item.getAttribute('name')})
        }
    }
}


//- Substract previous message time from the next, if difference wise is impactful enough, eg: more than 1h difference, then show time, else don't, also make this custom within settings ;)
//RIGHT NOW
//    - Chats work of #tags, very insecure, in future it will all be controlled by the server.

//    - Server can store user session like in PHP, basically it'll store what buttons it pressed in main
//      - to know what to show in this page, if server session tells the user surfing that it's not true,
//        -then we can redirect the user to main menu immediately.

//hide chat, back to menu
function back_to_menu() {
    delete page.inMessage
    let msgdiv = document.getElementById('msgdiv')
    removeClass(msgdiv, "loader")
    addClass(msgdiv, "unloader")
    setTimeout(function () {
      document.getElementById('msgdiv').style.display = 'none';
      document.getElementById('messages').innerHTML = ""; //clear messages from messages screen
    }, 200)
  }
  
  
