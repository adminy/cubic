//show list of users you last talked to, 
function list_contacts(contacts, local) {
    // console.log(contacts)
    if(!local)
      Array.prototype.push.apply(page.contacts, contacts)   // Store the contacts in page.contacts
    if (!('list_contacts' in page))
      document.getElementById('biz').innerHTML = ""
    page.list_contacts = true
  
  
    //DON'T FORGET THE UNDERLINING ;)
    var foundAt, name, text
    for(let i = 0; i < contacts.length; i++) {    
      if(contacts[i].name_search) {
        foundAt = contacts[i].name.indexOf(contacts[i].name_search);
        name = contacts[i].name.substring(0, foundAt) + '<span style="color:orange">' + contacts[i].name_search + '</span>' +
                   contacts[i].name.substring(foundAt + contacts[i].name_search.length, contacts[i].name.length)
  
      } else {
        name = contacts[i].name
      }
      if(contacts[i].text_search) {
        foundAt = contacts[i].text.indexOf(contacts[i].text_search);
        text = contacts[i].text.substring(0, foundAt) + '<span style="color:orange">' + contacts[i].text_search + '</span>' +
                   contacts[i].text.substring(foundAt + contacts[i].text_search.length, contacts[i].text.length)
  
      } else {
        text = contacts[i].text
      }
       document.getElementById('biz').innerHTML += '\
       <li class="chat collection-item avatar chat-unread waves-effect list_item" title="'+contacts[i].userID+'" alt="'+contacts[i].service+'" name="'+contacts[i].name+'" data="contact">\
           <img src="'+contacts[i].avatar+'" alt="'+contacts[i].userID+'" class="circle">\
           <span class="chat-title">'+name+ (contacts[i].service == 'skype' ? '<img src="https://i.imgur.com/edQkxse.png" style="width:29px; height:29px">' : 
                                                                              '<img src="https://i.imgur.com/bOl3IOa.png"  style="width:29px; height:29px">') + '</span>\
           <p class="truncate grey-text">'+text+'</p>\
           <span class="blue-text ultra-small">'+new Date(parseInt(contacts[i].timestamp)).toUTCString()+'</span>\
       </li>';
  
      }
      // console.log('contacts load is Done')
       menu_to_message()
  }