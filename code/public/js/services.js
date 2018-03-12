//MAKE A DELETE BUTTON !!!
//SHOW ACTIVE/INACTIVE SERVICES !
function removeService(element, user) {
  if(ws)
    ws.send(JSON.stringify({removeService: user, token: getCookie('wss')}))
  element.parentElement.parentElement.remove()
}


function list_services(services_list) {
    var sl = document.getElementById('services_list');
    if (services_list.length > 0) {
      //[{"userID":1,"name":"Marin","avatar":"https://scontent.xx.fbcdn.net/v/l/t1.0-1/c8.0.50.50/p50x50/27655308_386518601810878_8915518499602564658_n.jpg?oh=9309c15d60ab1b1b702dd1cef7e30ae9&oe=5B0FBD80","service":"facebook","user":"353877102239"},{"userID":1,"name":"Marin","avatar":"https://scontent.xx.fbcdn.net/v/l/t1.0-1/c8.0.50.50/p50x50/27655308_386518601810878_8915518499602564658_n.jpg?oh=9309c15d60ab1b1b702dd1cef7e30ae9&oe=5B0FBD80","service":"skype","user":"life4anime8"}]
      sl.innerHTML = "<div style='text-align:center'>(" + services_list[0].userID + ")<br><img src='" + services_list[0].avatar + "' style='width:48px;height:48px;border-radius:50%;'><br>" + services_list[0].name + "</div>"
      sl.innerHTML += "<div style='height:20px;font-weight:bold;'><div style='display:inline-block;float:left;'>Service</div><div style='display:inline-block;float:right;'>User&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Action</div></div><hr>"
      for (let i = 0; i < services_list.length; i++)
        sl.innerHTML += "<div style='height:20px;"+(services_list[i].active ? 'color:green' : 'color: grey;')+"'><div style='display:inline-block;float:left;'>" + services_list[i].service + "</div><div style='display:inline-block;float:right;'>" + services_list[i].user + "&nbsp;&nbsp;&nbsp;<button style='display:inline-block;float:right;' onclick='removeService(this, \"" + services_list[i].user + "\")'><i class='material-icons red-text'>clear</i></button></div></div><hr>"
    } else
      sl.innerHTML = "No available Services, why don't you register one below :)"
  }
  
  function service_registration(service_name) {
    var user = document.getElementById('user')
    var pass = document.getElementById('pass')
    if ((service_name == 'facebook' || service_name == 'skype') && user.value && user.value.length > 3 && pass.value && pass.value.length > 3) {
      ws.send(JSON.stringify({ token: getCookie('wss'), user: user.value, pass: btoa(pass.value), service_name: service_name }))
      user.setAttribute('class', 'validate valid')
      pass.setAttribute('class', 'validate valid')
    } else {
      user.setAttribute('class', 'validate invalid')
      pass.setAttribute('class', 'validate invalid')
      M.toast({ html: 'Please Fill in your details...', classes: 'red' })
    }
  
  }

  function service_already_registered() {
    //make a message to tell the user their service is already in our database
    M.toast({ html: 'Account Already Exists, try another one.', classes: 'red' });
  
  }
  
  function service_successfully_registered(reg_data) {
    M.toast({ html: 'Successfully Registered ' + reg_data.service_name + ' Service (' + reg_data.user + ')!', classes: 'green' }); 
    document.getElementById('services_list').innerHTML += "<div style='height:20px;color:green'><div style='display:inline-block;float:left;'>" + reg_data.service_name + "</div><div style='display:inline-block;float:right;'>" + reg_data.user + "&nbsp;&nbsp;&nbsp;<button style='display:inline-block;float:right;' onclick='removeService(this, \"" + reg_data.user + "\")'><i class='material-icons red-text'>clear</i></button></div></div><hr>"
    //get the username/password HTML back
    //add to list registered service
  
  
  
  }