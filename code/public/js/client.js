var ws, connected = false, users, delet = false, page = {atLogin: false, LoggedIn: false, isTyping: new Date()}; //reduceto just ws?
                                                                                          page.isTyping.setSeconds(page.isTyping.getSeconds() - 30) //to tell the user is typing immediately

function show_menu() {
            document.getElementById('menu').style.display = 'block';
}

function hide_menu() {
             document.getElementById('menu').style.display = 'none';
}
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
                  ws.send(JSON.stringify({fb_send: textarea.value, toUser: page.talkingTo,  token: getCookie("wss")}))
                  document.getElementById('messages').innerHTML += '<div class="from-me">'+textarea.value+'</div><div class="clear"></div>';
                  document.getElementById("messages").scrollTo(0,document.getElementById("messages").scrollHeight);
                  textarea.value = '';
                  return false;
                }
                else if(textarea.value.length > 0 && ws && parseInt((new Date() - page.isTyping)/1000) > 30) {
                                                    ws.send(JSON.stringify({fb_typing: page.talkingTo, token: getCookie("wss")}))
                                                    page.isTyping = new Date();
                }
                else return true;
}

//show list of users you last talked to, 
function showListThreads(fb_threads) {
                users = fb_threads;
                document.getElementById('biz').innerHTML = "";
                for(let i = 0; i < users.length; i++)
                  document.getElementById('biz').innerHTML += '\
                  <li class="chat collection-item avatar chat-unread waves-effect list_item" title="'+users[i].userID+'">\
                      <img src="'+users[i].avatar+'" alt="'+users[i].userID+'" class="circle">\
                      <span class="chat-title">'+users[i].name+'</span>\
                      <p class="truncate grey-text">'+users[i].text+'</p>\
                      <span class="blue-text ultra-small">'+new Date(parseInt(users[i].timestamp)).toUTCString()+'</span>\
                  </li>';
                  menu_to_message()
}
function menu_to_message() {
                  var items = document.getElementsByClassName('list_item');
                      for (var i = 0; i < items.length; i++) {
                        items[i].onclick = function (event) {
                          if(ws) ws.send(JSON.stringify({fb_get_msg: this.getAttribute('title'), token: getCookie("wss")}));
                          page.talkingTo = this.getAttribute('title'); //set who you are going to talk to in the messages page
                          let msgdiv = document.getElementById('msgdiv')
                          removeClass(msgdiv, "unloader")
                          addClass(msgdiv, "loader")
                          document.getElementById('msgdiv').style.display = 'block';
                        }
                      }
}

function addMessages(msgs) {
                  // document.getElementById('messages').innerHTML = msgs;
                  for(let i = msgs.length - 1; i > -1; i--) {
                    // console.log(msgs[i])
                    //sent from listener -> //{ type: 'message', senderID: '100009664880073', body: '😂', threadID: '100009664880073', messageID: 'mid.$cAAAAA2qGIv5n-wPT1Vhyb6GtKY8O', attachments: [], timestamp: '1519508163541', isGroup: false }
                    //show time
                    document.getElementById('messages').innerHTML += '<div class="date">'+new Date( parseInt(msgs[i].timestamp) ).toUTCString()+'</div>';      

                      //SET NAMES utf8mb4;INSERT INTO fb_message (threadID, id, type, isGroup, senderID, unread, timestamp, text, reactions, files) VALUES (100000743033035, 'mid.$cAAAABQbOt_xoFO6CM1h46kzlJweE', 'message', 0, '100000743033035',1, 1519942974003, '', '', '[{"type":"video","filename":"video-1519942973.mp4","thumbnailUrl":"https://scontent-mxp1-1.xx.fbcdn.net/v/t15.3394-10/22642441_385834328517349_8987896680053198664_n.jpg?_nc_ad=z-m&_nc_cid=0&oh=effc14078743478e640e738a8f0815c8&oe=5AFFAC07","previewUrl":"https://scontent-mxp1-1.xx.fbcdn.net/v/t15.3394-10/22642441_385834328517349_8987896680053198664_n.jpg?_nc_ad=z-m&_nc_cid=0&oh=effc14078743478e640e738a8f0815c8&oe=5AFFAC07","previewWidth":202,"previewHeight":360,"ID":"1826663984035018","url":"https://video-mxp1-1.xx.fbcdn.net/v/t42.3356-2/22680614_1874282579555458_1438795395530643445_n.mp4/video-1519942973.mp4?vabr=327230&oh=06e4f4bf750db5cafd4689aedca37552&oe=5A99FFB3&dl=1","width":202,"height":360,"duration":4000}]') ON DUPLICATE KEY UPDATE unread=1;
                  //SET NAMES utf8mb4;INSERT INTO fb_message (threadID, id, type, isGroup, senderID, unread, timestamp, text, reactions, files) VALUES (100000743033035, 'mid.$cAAAABQbOt_xoFPGgDFh46xM8vvZc', 'message', 0, '100000743033035',1, 1519943178252, '', '', '[{"type":"audio","audioType":"VOICE_MESSAGE","isVoiceMail":false,"filename":"audioclip-1519943177000-175651.mp4","ID":"ATNuVhyBXDhgyQX7KgqUyFa4PucGw_EcF_1ns7mhf4W4NUIoEE35hXbqLx31UgykZwA0mHkLArDayT1Wivp7fRHingNJDtn7Z5mwFssLZwSNNk9GzAfF_0jwXJhiBroBLWC6GV5uVo0","url":"https://cdn.fbsbx.com/v/t59.3654-21/13438603_905828692894796_747253247_n.mp4/audioclip-1519943177000-175651.mp4?oh=2ad1c0d93ba0da729ffdcaef11e4abd4&oe=5A9AC414&dl=1","duration":175651}]') ON DUPLICATE KEY UPDATE unread=1;
                  // { type: 'message',senderID: '100000743033035',body: '',threadID: '100000743033035',messageID: 'mid.$cAAAABQbOt_xoFNKJ7Fh441Cog7r3', attachments: [ { type: 'photo',ID: '1826640127370737',filename: 'image-1826640127370737',thumbnailUrl: 'https://scontent-mrs1-1.xx.fbcdn.net/v/t34.0-0/p34x34/28535441_1826640127370737_2119404920_n.png?_nc_ad=z-m&_nc_cid=0&oh=d7351afbab984186b2f9b9ab6352d9b0&oe=5A99FB9F',previewUrl: 'https://scontent-mrs1-1.xx.fbcdn.net/v/t34.0-0/p280x280/28535441_1826640127370737_2119404920_n.png?_nc_ad=z-m&_nc_cid=0&oh=e5b1531a7aa76f6ac75cc1ab90f97075&oe=5A9B0EDD',previewWidth: 280,previewHeight: 345,largePreviewUrl: 'https://scontent-mrs1-1.xx.fbcdn.net/v/t34.0-12/28535441_1826640127370737_2119404920_n.png?_nc_ad=z-m&_nc_cid=0&oh=2ac1e86cf7d99fe631ed3f073065ba2c&oe=5A99F3DE',largePreviewWidth: 310,largePreviewHeight: 382,url: 'https://scontent-mrs1-1.xx.fbcdn.net/v/t34.0-12/28535441_1826640127370737_2119404920_n.png?_nc_ad=z-m&_nc_cid=0&oh=2ac1e86cf7d99fe631ed3f073065ba2c&oe=5A99F3DE',width: 310,height: 382 } ], mentions: {},timestamp: '1519941140972',isGroup: false }
                    if('text' in msgs[i] && msgs[i].text.length < 1 && msgs[i].files.length > 0) {
                      var dta = JSON.parse(msgs[i].files);
                      for(let j = 0; j < dta.length; j++) {
                        if('url' in dta[j] || 'preview' in dta[j] || 'playable_url' in dta[j] || 'animated_image' in dta[j]) {
                              document.getElementById('messages').innerHTML += '<div class="' + ((msgs[i].senderID == page.talkingTo) ? 'from-them' : 'from-me')+'">' + 
                               ((dta[j].type == 'video') ? '<video width="100%" height="100%" controls="controls"><source src="'+dta[j].url.substring(0, dta[j].url.length - 4)+'" type="video/mp4"></video>' :
                               ((dta[j].type == 'audio') ? '<audio src="'+dta[j].url.substring(0, dta[j].url.length - 4)+'" controls></audio>' : 
                               ((dta[j].type == 'photo') ? '<img src="'+dta[j].previewUrl+'" style="width:100%;height:100%"/>' : 
                               ((dta[j].__typename=="MessageVideo") ? '<video width="100%" height="100%" controls="controls"><source src="'+dta[j].playable_url.substring(0, dta[j].playable_url.length - 4)+'" type="video/mp4"></video>' :
                               ((dta[j].__typename=="MessageAudio") ? '<audio src="'+dta[j].playable_url.substring(0, dta[j].playable_url.length - 4)+'" controls></audio>' :            
                               ((dta[j].__typename == "MessageAnimatedImage") ? '<img src="'+dta[j].animated_image.uri+'" style="width:100%;height:100%;"/>' :                              
                               ((dta[j].__typename=='MessageImage') ? '<img src="'+dta[j].preview.uri+'" style="width:100%;height:100%;"/>' : 'Could Not Read your Message'))))))) +'</div><div class="clear"></div>'; //<img src="images/femaleblonde.jpg" alt="name" class="circle photo">
                        } else {
                          console.error('File Not Yet Supported? Kindly tell us what TYPE FILE it is?')
                          console.log(dta)
                        }
                      }

                    } else
                       document.getElementById('messages').innerHTML += '<div class="'+ ((msgs[i].senderID == page.talkingTo)? 'from-them' : 'from-me')+'">' + (msgs[i].body || msgs[i].text)+'</div><div class="clear"></div>'; //<img src="images/femaleblonde.jpg" alt="name" class="circle photo">

                      //scroll bottom
                    document.getElementById("messages").scrollTo(0,document.getElementById("messages").scrollHeight)
                  }
}
function userTying(data) {
            // console.log(data)
            if(page.talkingTo == data.from) {
              if(!data.isTying && !page.typer) {
                document.getElementById('messages').innerHTML += '<div class="from-them" id="typing_'+data.from+'"><img src="https://gifimage.net/wp-content/uploads/2017/11/facebook-typing-gif-4.gif" style="width:100px;height:40px"/></div>'; //<img src="images/femaleblonde.jpg" alt="name" class="circle photo">
                document.getElementById("messages").scrollTo(0,document.getElementById("messages").scrollHeight)
              } else {
                // if(document.getElementById('typing_'+data.from))
                  document.getElementById('typing_' + data.from).remove()
              }
              page.typer = !page.typer;
            }
}

function list_services(services_list) {
          var sl = document.getElementById('services_list');
          if(services_list.length > 0) {
            //[{"userID":1,"name":"Marin","avatar":"https://scontent.xx.fbcdn.net/v/l/t1.0-1/c8.0.50.50/p50x50/27655308_386518601810878_8915518499602564658_n.jpg?oh=9309c15d60ab1b1b702dd1cef7e30ae9&oe=5B0FBD80","service":"facebook","user":"353877102239"},{"userID":1,"name":"Marin","avatar":"https://scontent.xx.fbcdn.net/v/l/t1.0-1/c8.0.50.50/p50x50/27655308_386518601810878_8915518499602564658_n.jpg?oh=9309c15d60ab1b1b702dd1cef7e30ae9&oe=5B0FBD80","service":"skype","user":"life4anime8"}]
            sl.innerHTML = "<div style='text-align:center'>("+services_list[0].userID+")<br><img src='"+services_list[0].avatar+"' style='width:48px;height:48px;border-radius:50%;'><br>"+services_list[0].name + "</div>"
            sl.innerHTML += "<div style='height:20px;font-weight:bold;'><div style='display:inline-block;float:left;'>Service</div><div style='display:inline-block;float:right;'>User</div></div><hr>"
            for(let i = 0; i < services_list.length; i++)
              sl.innerHTML += "<div style='height:20px;'><div style='display:inline-block;float:left;'>"+services_list[i].service+"</div><div style='display:inline-block;float:right;'>"+services_list[i].user+"</div></div><hr>"
          } else
            sl.innerHTML = "No available Services, why don't you register one below :)"
}

function service_registration(service_name) {
  var user = document.getElementById('user')
  var pass = document.getElementById('pass')
  if((service_name == 'facebook' || service_name == 'skype' || service_name == 'hangouts') && user.value && user.value.length > 3 && pass.value && pass.value.length > 3) {
    ws.send(JSON.stringify({token: getCookie('wss'), user: user.value, pass:pass.value, service_name: service_name}))
    user.setAttribute('class', 'validate valid')
    pass.setAttribute('class', 'validate valid')
  } else {
    user.setAttribute('class', 'validate invalid')
    pass.setAttribute('class', 'validate invalid')
    M.toast({html: 'Please Fill in your details...', classes: 'red'})
  }

}

//if server requests indentification or user already was connected (already posseses a key)?
function token_setup(token) {
                      eraseCookie('wss') //delete the one we have
                      setCookie('wss', token, 480)
                      // console.log("Current Token in cookie: " + getCookie('wss'))
                      if(!page.LoggedIn) {
                                       ws.send(JSON.stringify({fb_threads: 100013582237495})) //hardcoded PLEASE REMOVE ME
                                       ws.send(JSON.stringify({my_services: getCookie('wss')}))
                      }
                      page.LoggedIn = true;
}


function service_already_registered() {
  //make a message to tell the user their service is already in our database
  M.toast({html: 'Account Already Exists, try another one.', classes: 'red'});

}

function service_successfully_registered(reg_data) {
  M.toast({html: 'Successfully Registered '+reg_data.service_name+' Service ('+reg_data.user+')!', classes: 'green'});
  document.getElementById('services_list').innerHTML += "<div style='height:20px;'><div style='display:inline-block;float:left;'>"+reg_data.service_name+"</div><div style='display:inline-block;float:right;'>"+reg_data.user+"</div></div><hr>"
  //get the username/password HTML back
  //add to list registered service

 

}
window.onload = function() {
  ws = new WebSocket("wss://ie.dyndns.biz")
  ws.onopen = function(e) { 
    ws.send(JSON.stringify({token: getCookie('wss') || ''}))
    // console.log("User Token Sent to Server (if any)")
    load_page('main.html', document.body)
  }

  ws.onmessage = function(response) {
    var data = JSON.parse(response.data)
    switch(Object.keys(data)[0]) {
      case                           'token': token_setup(data.token);                                               break;
      case                       'ask_login': login_page();                                                          break;
      case                     'my_services': list_services(data.my_services);                                       break;
      case                	    'fb_threads': showListThreads(data.fb_threads);                                      break;
      case                      'fb_res_msg': addMessages(data.fb_res_msg);                                          break;
      case                  'fb_user_typing': userTying(data.fb_user_typing);                                        break;
      case      'service_already_registered': service_already_registered();                                          break;
      case 'service_successfully_registered': service_successfully_registered(data.service_successfully_registered); break;
      default              : console.log(data);                break; //https://stackoverflow.com/a/26139061/7055163
    }
  }

  ws.onerror = ws.onclose = function() { /* attempt reconnect / recovery */ }
}



    //- Substract previous message time from the next, if difference wise is impactful enough, eg: more than 1h difference, then show time, else don't, also make this custom within settings ;)
    //RIGHT NOW
    //    - Chats work of #tags, very insecure, in future it will all be controlled by the server.

    //    - Server can store user session like in PHP, basically it'll store what buttons it pressed in main
    //      - to know what to show in this page, if server session tells the user surfing that it's not true,
    //        -then we can redirect the user to main menu immediately.

    //hide chat, back to menu
    function back_to_menu() {
      let msgdiv = document.getElementById('msgdiv')
      removeClass(msgdiv, "loader")
      addClass(msgdiv, "unloader")
      setTimeout(function () {
        document.getElementById('msgdiv').style.display = 'none';
        document.getElementById('messages').innerHTML = ""; //clear messages from messages screen
      }, 200)
    }
