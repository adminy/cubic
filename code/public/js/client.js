var ws, connected = false, atLogin = false, users, delet = false; //reduceto just ws?
function login_page() {
              (function(d, s, id){ var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) {return;} js = d.createElement(s); js.id = id; js.src = 'https://connect.facebook.net/en_US/sdk.js'; fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'facebook-jssdk'));

              var script = document.createElement('script');
                  script.type = 'text/javascript';
                  script.src = 'https://apis.google.com/js/platform.js';
                  script.async = true;
                  script.defer = true;
                  document.getElementsByTagName('head')[0].appendChild(script);
              load_page('login.html', document.body)
}
//send_text_message on pressing enter
function keysPress(textarea) {
              var key = window.event.keyCode;
                if (key === 13 && ws) { // If the user has pressed enter
                  ws.send(JSON.stringify({fb_send: textarea.value, toUser: location.hash.slice(1)}))
                  document.getElementById('messages').innerHTML += '<div class="from-me">'+textarea.value+'</div><div class="clear"></div>';
                  document.getElementById("messages").scrollTo(0,document.getElementById("messages").scrollHeight);
                  textarea.value = '';
                  return false;
                }
                else return true;
}

//show list of users you last talked to, 
function showListThreads(fb_threads) {
                users = fb_threads;
                document.getElementById('biz').innerHTML = "";
                for(let i = 0; i < users.length; i++)
                  document.getElementById('biz').innerHTML += '\
                  <li class="chat collection-item avatar chat-unread waves-effect list_item">\
                    <a href="#thread_'+users[i].userID+'">\
                      <img src="'+users[i].avatar+'" alt="'+users[i].userID+'" class="circle">\
                      <span class="chat-title">'+users[i].name+'</span>\
                      <p class="truncate grey-text">'+users[i].text+'</p>\
                      <span class="blue-text ultra-small">'+new Date(parseInt(users[i].timestamp)).toUTCString()+'</span>\
                    </a>\
                  </li>';
                  menu_to_message()
}

function addNewMessage(msg) {
                  document.getElementById('messages').innerHTML += '<div class="from-them card"><img src="images/femaleblonde.jpg" alt="John Doe" class="circle photo">'+msg+'</div><div class="clear"></div>';
}

function addMessages(msgs) {
                  for(let i = msgs.length - 1; i > -1; i--) {
                    // console.log(msgs[i])
                    //sent from listener -> //{ type: 'message', senderID: '100009664880073', body: '😂', threadID: '100009664880073', messageID: 'mid.$cAAAAA2qGIv5n-wPT1Vhyb6GtKY8O', attachments: [], timestamp: '1519508163541', isGroup: false }
                    //show time
                    document.getElementById('messages').innerHTML += '<div class="date">'+new Date( parseInt(msgs[i].timestamp) ).toUTCString()+'</div>';      
                    //is this not you?
                    if(msgs[i].senderID == location.hash.substring(8)) //find better way to represent NOT your ID
                      document.getElementById('messages').innerHTML += '<div class="from-them">'+(msgs[i].body || msgs[i].text)+'</div><div class="clear"></div>'; //<img src="images/femaleblonde.jpg" alt="name" class="circle photo">
                    else //you
                      document.getElementById('messages').innerHTML += '<div class="from-me">'+(msgs[i].body || msgs[i].text)+'</div><div class="clear"></div>';          
                    //scroll bottom
                    document.getElementById("messages").scrollTo(0,document.getElementById("messages").scrollHeight);
                  }
}
//if server requests indentification or user already was connected (already posseses a key)?
function token_setup(data) {
                  if (getCookie('wss') != null) { //we have a token so we are not NEW
                    if(data.verified)  {  //our token is not matching what server is sending us (data.token != getCookie('wss'))
                      eraseCookie('wss') //delete the one we have
                      setCookie('wss', data.token, 7)
                      console.log("Cookie ('wss') recognised by the server")
                    }
                    console.log("Current Token in cookie: " + getCookie('wss'))
                    connected = true
                  } else {
                    login_page()
                    setCookie('wss', data.token, 7)
                    console.log("Set Cookie for 7 days of an ('wss')")
                    connected = true
                  }
}

window.onload = function() {
  ws = new WebSocket("wss://ie.dyndns.biz")
  ws.onopen = function(e) { 
    ws.send(JSON.stringify({token: getCookie('wss') || ''})); console.log("User Token Sent to Server (if any)")
    //hardcoded PLEASE REMOVE ME
    if(!atLogin) {
      ws.send(JSON.stringify({fb_threads: 100013582237495}))
      load_page('main.html', document.body)
    }
  }

  ws.onmessage = function(response) {
    var data = JSON.parse(response.data)
    switch(Object.keys(data)[0]) {
      case      'token': token_setup(data);                break;
      case 'fb_threads': showListThreads(data.fb_threads); break;
      // case   'verified': window.location.reload();         break;
      case 'fb_message': addNewMessage(data.fb_message);   break;
      case 'fb_res_msg': addMessages(data.fb_res_msg);     break;
      default          : console.log(data);                break; //https://stackoverflow.com/a/26139061/7055163
    }
  }

  ws.onerror = ws.onclose = function() { /* attempt reconnect / recovery */ }
}


//shitty way of doing things, let user on serverside to just know what you press through socket connection
window.onhashchange = function() {
  //user requests a FB thread to open up
  if(location.hash.substring(0, 8) == "#thread_" && /^\d+$/.test(location.hash.substring(8)) && ws)
    ws.send(JSON.stringify({fb_get_msg: location.hash.substring(8), token: getCookie('wss')}))
  else
    document.getElementById('messages').innerHTML = "";
}