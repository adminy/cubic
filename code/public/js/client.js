//if server requests indentification or user already was connected (already posseses a key)?
function token_setup(token) {
  eraseCookie('wss') //delete the one we have
  setCookie('wss', token, 480)
  // console.log("Current Token in cookie: " + getCookie('wss'))
  if (!page.LoggedIn)
    ws.send(JSON.stringify({ my_services: getCookie('wss') }))
  page.LoggedIn = true;
}

function websocket() {
  ws = new WebSocket("wss://ie.dyndns.biz")
  ws.onopen = function (e) {
    ws.send(JSON.stringify({ token: getCookie('wss') || '' }))
    // console.log("User Token Sent to Server (if any)")
    load_page('main.html', document.body)
  }

  ws.onmessage = function (response) {
    var data = JSON.parse(response.data)
    switch (Object.keys(data)[0]) {
      case 'token': token_setup(data.token); break
      case 'groups': list_groups(data.groups); break
      case 'contacts': list_contacts(data.contacts); break
      case 'message': handle_message(data.message); break
      case 'messages': list_messages(data.messages); break
      // case 'group_messages': group_messages(data.group_messages); break //they should just be same as contact messages
      // case 'contact_messages': contact_messages(data.contact_messages); break //they should just be same as group messages
      
      case 'ask_login': login_page(); break
      case 'my_services': list_services(data.my_services); break
      case 'fb_res_msg': addMessages(data.fb_res_msg); break
      case 'fb_user_typing': userTying(data.fb_user_typing); break
      case 'service_already_registered': service_already_registered(); break
      case 'service_successfully_registered': service_successfully_registered(data.service_successfully_registered); break
      case 'group_successfully_created': group_successfully_created(data.group_successfully_created); break
      default: console.log(data)
    }
  }

  ws.onerror = ws.onclose = function () {  setTimeout(websocket, 8000) /*   websocket() => attempt reconnect / recovery every 8 seconds */ }
}

window.onload = websocket;