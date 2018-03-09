var ws, connected = false, users, delet = false, page = { atLogin: false, LoggedIn: false, isTyping: new Date(), contacts: [], groups: [], selectedContacts: [], selectedGroups: [] }
page.isTyping.setSeconds(page.isTyping.getSeconds() - 30) //to tell the user is typing immediately

function menu_to_message() {
    var items;
    items = document.getElementById('contacts').children;
    for (var i = 0; i < items.length; i++) {
      items[i].onclick = function (event) {
        if(page.makeGroup) selectedContact(this)
        else { //you are going to what you clicked thread
          page.inMessage = true
          if (ws) ws.send(JSON.stringify({ get_user_messages: this.getAttribute('title'), service_name: this.getAttribute('alt'), token: getCookie("wss") }))
          page.talkingTo = this.getAttribute('title') //set who you are going to talk to in the messages page
          page.talkingToService = this.getAttribute('alt')
          page.talkingToName = this.getAttribute('name')
          page.talkingToAvatar = this.children[0].src
        //   page.talkingToName = this.children[1].children[0]
          let msgdiv = document.getElementById('msgdiv')
          removeClass(msgdiv, "unloader")
          addClass(msgdiv, "loader")          
          document.getElementById('msgdiv').style.display = 'block';
          document.getElementById('threadName').innerHTML = page.talkingToName
          //get messages layout for a contact
          document.getElementById('message_container').style.left = '10px';
          document.getElementById('option_selectors').innerHTML = ''
        }
      }
    }

    items = document.getElementById('groups').children;
    for (var i = 0; i < items.length; i++) {
      items[i].onclick = function (event) {
        if(page.breakGroup) selectedGroup(this)
        else { //you are going to what you clicked thread
          page.inMessage = true
          page.fromGroupinMessage = true
          if (ws) ws.send(JSON.stringify({ get_group_messages: this.getAttribute('title'), services: this.getAttribute('alt'), token: getCookie("wss") }))
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
          item.setAttribute('style', 'background:#ffcccc')
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
            item.setAttribute('style', 'background:#ffcccc')
            page.selectedGroups.push({groupID: item.getAttribute('title'), service: item.getAttribute('alt'), name: item.getAttribute('name')})
        }
    }
}
  
  




function show_menu() { document.getElementById('menu').style.display = 'block'; }
function hide_menu() { document.getElementById('menu').style.display = 'none'; }

function back_to_menu() {
    delete page.talkingTo
    delete page.talkingToService
    delete page.talkingToName
    delete page.inMessage
    delete page.fromGroupinMessage
    let msgdiv = document.getElementById('msgdiv')
    removeClass(msgdiv, "loader")
    addClass(msgdiv, "unloader")
    setTimeout(function () {
      document.getElementById('msgdiv').style.display = 'none';
      document.getElementById('messages').innerHTML = ""; //clear messages from messages screen
    }, 200)
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
    page.selectedContacts = []
    page.selectedGroups = []
    clearSelect()
}

function clearSelect() {
    var items
    items = document.getElementById('contacts').children
    for(let i = 0; i < items.length; i++)
        items[i].removeAttribute('style')
    items = document.getElementById('groups').children
    for(let i = 0; i < items.length; i++)
        items[i].removeAttribute('style')
}