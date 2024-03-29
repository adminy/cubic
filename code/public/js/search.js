//this implementation can handle up to 1000 users just fine, but after that HTML is the limitation, perhaps reduce immediate display
function searching(input_box) {
    // var key = window.event.keyCode; key === 13 && //<--this was useful searching on enter
    if(page.contacts && !page.inMessage) {
      if( page.contacts.length > 0) {
  
        document.getElementById('contacts').innerHTML = "";
  
        var searched_contacts = []
        for(let i = 0; i < page.contacts.length; i++) {
          //clear previous search
          if('name_search' in page.contacts[i])
            delete page.contacts[i].name_search
  
          if('text_search' in page.contacts[i])
            delete page.contacts[i].text_search
  
          //indentify new search
  
          if((page.contacts[i].name && page.contacts[i].name.toLowerCase().indexOf(input_box.value.toLowerCase()) !== -1)  || 
             (page.contacts[i].text && page.contacts[i].text.toLowerCase().indexOf(input_box.value.toLowerCase()) !== -1)) {
            if(page.contacts[i].name && page.contacts[i].name.toLowerCase().indexOf(input_box.value.toLowerCase()) !== -1)
              page.contacts[i].name_search = input_box.value;
  
            if(page.contacts[i].text && page.contacts[i].text.toLowerCase().indexOf(input_box.value.toLowerCase()) !== -1)
              page.contacts[i].text_search = input_box.value;
  
            searched_contacts.push(page.contacts[i])
  
          
         }
        }
        if(searched_contacts.length > 0)
          list_contacts(searched_contacts, true)  //true for local 
        else
          document.getElementById('contacts').innerHTML = '<h5>Sorry, \"<span style="color:orange">'+input_box.value+'\"</span> Not Found!</h5>'
  
        
      } else {
        list_contacts(page.contacts, true)
      }
  
      // page.selectedContacts = []
  
    }
  }