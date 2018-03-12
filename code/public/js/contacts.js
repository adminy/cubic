function list_contacts(contacts, local) { //show list of users you last talked to, 
  if (!local) {
    Array.prototype.push.apply(page.contacts, contacts)   // Store the contacts in page.contacts
    sortByKey(page.contacts, 'service')
    sortByKey(page.contacts, 'timestamp')
  }
  if (!('list_contacts' in page))
    document.getElementById('contacts').innerHTML = ""
  page.list_contacts = true

  var len = ((contacts.length > 20) ? 20 : contacts.length)
  var foundAt, name, text

  for (let i = 0; i < len; i++) {
    if (contacts[i].name_search) {
      foundAt = contacts[i].name.toLowerCase().indexOf(contacts[i].name_search.toLowerCase());
      name = contacts[i].name.substring(0, foundAt) + '<span style="color:orange">' + contacts[i].name.substr(foundAt, contacts[i].name_search.length) + '</span>' +
        contacts[i].name.substring(foundAt + contacts[i].name_search.length, contacts[i].name.length)

    } else {
      name = contacts[i].name
    }
    if (contacts[i].text_search) {
      foundAt = contacts[i].text.toLowerCase().indexOf(contacts[i].text_search.toLowerCase());
      text = contacts[i].text.substring(0, foundAt) + '<span style="color:orange">' + contacts[i].text.substr(foundAt, contacts[i].text_search.length) + '</span>' +
        contacts[i].text.substring(foundAt + contacts[i].text_search.length, contacts[i].text.length)

    } else {
      text = contacts[i].text
    }

    let selected = ""
    for (let j = 0; j < page.selectedContacts.length; j++)
      if (contacts[i].userID == page.selectedContacts[j].userID)
        selected = 'style="background:#ffcccc"'

    document.getElementById('contacts').innerHTML += '\
       <li class="chat collection-item avatar chat-unread waves-effect list_item" '+ selected + ' title="' + contacts[i].userID + '" alt="' + contacts[i].service + '" name="' + contacts[i].name + '" data="contact">\
           <img src="'+ contacts[i].avatar + '" alt="' + contacts[i].userID + '" class="circle">\
           <span class="chat-title"><span>'+ name + '</span>' + (contacts[i].service == 'skype' ? '<img src="https://i.imgur.com/edQkxse.png" style="width:29px; height:29px">' :
        '<img src="https://i.imgur.com/bOl3IOa.png"  style="width:29px; height:29px">') + '</span>' +
      (text ? '<p class="truncate grey-text">' + text + '</p>' : '<p class="truncate grey-text">...</p>') +
      '<span class="blue-text ultra-small">' + (contacts[i].timestamp ? new Date(parseInt(contacts[i].timestamp)).toUTCString() : '...') + '</span>\
       </li>';
  }
  // console.log('contacts load is Done')
  menu_to_message()
}