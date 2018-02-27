var ws, user_token, connected = false, atLogin = false, users;

function keysPress(textarea) {
  var key = window.event.keyCode;
    if (key === 13) { // If the user has pressed enter
      ws.send(JSON.stringify({fb_send: textarea.value, toUser: location.hash.slice(1)}))
      document.getElementById('messages').innerHTML += '<div class="from-me">'+textarea.value+'</div><div class="clear"></div>';
      document.getElementById("messages").scrollTo(0,document.getElementById("messages").scrollHeight);
      textarea.value = '';
      return false;
    }
    else return true;
}


window.onload = function() {
  startup()
  user_token = getCookie('wss');
  
  ws = new WebSocket("wss://ie.dyndns.biz")
  ws.onopen = function(e) { 
    console.log("User Connected")
    //send client token to server
    ws.send(JSON.stringify({token: user_token || ''}))

    //hardcoded PLEASE REMOVE ME
    ws.send(JSON.stringify({get_fb_threads: 100013582237495}))

    // if(location.hash.slice(1))
    //   ws.send(JSON.stringify({fb_get_msg: location.hash.slice(1)}))

  }

  ws.onmessage = function(response) {
    var data = JSON.parse(response.data)
    
    if('fb_threads' in data) {
      users = data.fb_threads;
      for(let i = 0; i < users.length; i++)
        document.getElementById('biz').innerHTML += '<li class=" chat collection-item avatar chat-unread waves-effect" id="test"><i class="mdi-social-group icon blue-text"></i><img src="'+users[i].avatar+'" alt="'+users[i].userID+'" class="circle"><span class="chat-title">'+users[i].name+'</span><p class="truncate grey-text">'+users[i].text+'</p><a href="#thread-'+users[i].userID+'" class="secondary-content"><i class="material-icons">chevron_right</i></a><a href="#!" class="chat-time bottom-right"><span class="blue-text ultra-small">'+new Date(parseInt(users[i].timestamp)).toUTCString()+'</span></a></li>';
    }  
    //if server requests indentification or user already was connected (already posseses a key)?
    if('token' in data) {
      if (user_token != null) {
        if(data.token != user_token)  {
          eraseCookie('wss')
          setCookie('wss', data.token, 7)
          console.log("Cookie USER_TOKEN reset as server does not have such cookie!")
          user_token = data.token //this is the new token
        }

        connected = true
        console.log("Current Token in cookie: " + user_token, data)
      } else {
        setCookie('wss', data.token, 7)
        console.log("Set Cookie for 7 days of an USER_TOKEN")
        user_token = data.token //this is the new token
        connected = true
      }
    }
    if('verified' in data && atLogin)
      post('/main', {}, "GET") 


      if('fb_message' in data) {
        console.log(data.fb_message);
        document.getElementById('messages').innerHTML += '<div class="from-them card"><img src="images/femaleblonde.jpg" alt="John Doe" class="circle photo">'+data.fb_message+'</div><div class="clear"></div>';
      
      }  

      if('fb_res_msg' in data) {
        for(let i = data.fb_res_msg.length - 1; i > -1; i--) {
          // console.log(data.fb_res_msg[i])
          
          //sent from listener
          //{ type: 'message', senderID: '100009664880073', body: '😂', threadID: '100009664880073', messageID: 'mid.$cAAAAA2qGIv5n-wPT1Vhyb6GtKY8O', attachments: [], timestamp: '1519508163541', isGroup: false }
        
          //show time
          document.getElementById('messages').innerHTML += '<div class="date">'+new Date( parseInt(data.fb_res_msg[i].timestamp) ).toUTCString()+'</div>';      
          //is this not you?
          if(data.fb_res_msg[i].senderID == location.hash.slice(1))
            document.getElementById('messages').innerHTML += '<div class="from-them">'+(data.fb_res_msg[i].body || data.fb_res_msg[i].text)+'</div><div class="clear"></div>'; //<img src="images/femaleblonde.jpg" alt="name" class="circle photo">
          else //you
            document.getElementById('messages').innerHTML += '<div class="from-me">'+(data.fb_res_msg[i].body || data.fb_res_msg[i].text)+'</div><div class="clear"></div>';          
          //scroll bottom
          document.getElementById("messages").scrollTo(0,document.getElementById("messages").scrollHeight);
        }
      }

    } //on message
  ws.onerror = ws.onclose = function() { /* attempt reconnect / recovery */ }
  $(window).on('hashchange',function(){
    ws.send(JSON.stringify({fb_get_msg: location.hash.slice(1)}))
  });
}




 //____________________________________________Post/Get Method
function post(path, params, method) {
  method = method || "post"; // Set method to post by default if not specified.

  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for(var key in params) {
      if(params.hasOwnProperty(key)) {
          var hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", params[key]);

          form.appendChild(hiddenField);
      }
  }

  document.body.appendChild(form);
  form.submit();
}

//______________________________________________________COOKIE ::::::::::::::::::::::::::::::::::::::::::::::::::::
function setCookie(name,value,days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
function eraseCookie(name) {   
  document.cookie = name+'=; Max-Age=-99999999;';  
}

//__________________Try every 0.1 seconds until CONDITION == true
function keepdo(condition, callback) {
  if(condition)
    callback();
  else
    setTimeout(function() { keepdo(condition, callback)}, 100);
}
