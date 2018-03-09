
function breakGroup() {
    // console.log('break group clicked')
    hide_menu()
    document.getElementById('top_bar').innerHTML = "<div style='text-align:center'><button style='float:left; height:60px;color: black' class='waves-effect waves-light btn yellow' onclick='cancelActions()'> Cancel</button>"+
                                                   "<b><span style='color: black; font-size:30px'>Cubik</span></b><button style='float:right;height:60px' class='waves-effect waves-light btn red' onclick='deleteGroup()'>Delete Group</button></div>"
      
    page.breakGroup = true
  }
  function makeGroup() {
    // console.log('make group clicked')
    hide_menu()
    document.getElementById('top_bar').innerHTML = "<div style='text-align:center'><button style='float:left; height:60px;color: black' class='waves-effect waves-light btn yellow' onclick='cancelActions()'> Cancel</button>"+
                                                   "<b><span style='color: black; font-size:30px'>Cubik</span></b><button style='float:right;height:60px' class='waves-effect waves-light btn green' onclick='createGroup()'>Create Group</button></div>"
    page.makeGroup = true
   
  }

function createGroup() {
    if(ws) {
      var name = "", services = ""
      for(let i = 0; i < page.selectedContacts.length; i++) {
        name += page.selectedContacts[i].name + ', '
        services += page.selectedContacts[i].service+','
      }
      name = name.substring(0, name.length - 2)
      services = services.substring(0, services.length - 1)
  
      var name2 = prompt("Please enter a group Name ...", name);
      if (name2 != null) {
        var group = {createGroup: page.selectedContacts, token: getCookie('wss'), name: name2, services: services}
        // console.log(group)
        ws.send(JSON.stringify(group))
      }
    }
  }
  
  function deleteGroup() {
      if(ws)
        ws.send(JSON.stringify({destroyGroup: page.selectedGroups, token: getCookie('wss')}))
       var newGroups = []
        for(var i = 0; i < page.groups.length; i++)
            for(var j = 0; j < page.selectedGroups.length; j++)
                if(page.groups[i].groupID != page.selectedGroups[j].groupID)
                    newGroups.push(page.groups[i])
        page.groups = newGroups
        list_groups(page.groups, true)
        M.toast({ html: 'Group(s) Successfully Deleted!', classes: 'green' })
        cancelActions()
  }



function group_successfully_created(group) {
    M.toast({ html: '<img src="'+group.avatar+'" style="width:29px;height:29px;">' + group.name + ' Successfully Created!', classes: 'green' })
    
    var services_html = ""
    var services = group.services.split(',')
    for(let i = 0; i < services.length; i++) {
        services_html += (services[i]=='facebook'? '<img src="https://i.imgur.com/bOl3IOa.png" style="width:29px; height:29px">' : '<img src="https://i.imgur.com/edQkxse.png" style="width:29px; height:29px">')
    }
    
    
    document.getElementById('groups').innerHTML += '\
       <li class="chat collection-item avatar chat-unread waves-effect list_item" title="'+group.groupID+'" alt="'+group.services+'" name="'+group.name+'" data="group">\
           <img src="'+group.avatar+'" alt="'+group.groupID+'" class="circle">\
           <span class="chat-title">'+group.name + services_html + '</span>\
           <p class="truncate grey-text">...</p>\
           <span class="blue-text ultra-small">...</span>\
       </li>';
    
    //: avatar: "https://i.imgur.com/gKCrzGD.png"groupID: 1, name: "Petrică Duhlicher, Petru Duhlicher"
    cancelActions()
    
  }
  
  function list_groups(groups, local) {
    if(!local) //local function means we don't restore the groups that are already stored in groups, it's not a server copy, it's local
      Array.prototype.push.apply(page.groups, groups)   // Store the groups in page.groups    
    document.getElementById('groups').innerHTML = ''
    var services_html, group_services
    for(let i = 0; i < groups.length; i++) {
      services_html = ""
      group_services = groups[i].services.split(',')
      for(let j = 0; j < group_services.length; j++)
        services_html += (group_services[j]=='facebook'? '<img src="https://i.imgur.com/bOl3IOa.png" style="width:29px; height:29px">' : '<img src="https://i.imgur.com/edQkxse.png" style="width:29px; height:29px">')

      document.getElementById('groups').innerHTML += '\
       <li class="chat collection-item avatar chat-unread waves-effect list_item" title="'+groups[i].groupID+'" alt="'+groups[i].services+'" name="'+groups[i].name+'">\
           <img src="'+groups[i].avatar+'" alt="'+groups[i].groupID+'" class="circle">\
           <span class="chat-title">'+groups[i].name + services_html + '</span>\
           <p class="truncate grey-text">...</p>\
           <span class="blue-text ultra-small">'+groups[i].creation_timestamp+'</span>\
       </li>';
    }
    menu_to_message()
    
  }