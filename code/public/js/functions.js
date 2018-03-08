//CLIENTSIDE `generic` javascript functions
function addClass(elem, className) {
    elem.className += ' ' + className
}

function removeClass(elem, className) {
    let elemClass = ' ' + elem.className + ' ';
    while(elemClass.indexOf(' ' + className + ' ') !== -1){
        elemClass = elemClass.replace(' ' + className + ' ', '');
    }
    elem.className = elemClass;
}
//eg:  load_page('blog.html', document.body)
function load_page(url, element){
    var xhr = new XMLHttpRequest();
        xhr.open("GET",url, true);
        xhr.setRequestHeader('Content-type', 'text/html');
        xhr.send();
        xhr.onreadystatechange = function(e) {
            if(xhr.readyState == 4 && xhr.status == 200)
                element.innerHTML = xhr.responseText;
        }
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

    
    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }
// var people = [
//     {
//         name: 'a75',
//         item1: false,
//         item2: false
//     },
//     {
//         name: 'z32',
//         item1: true,
//         item2: false
//     },
//     {
//         name: 'e77',
//         item1: false,
//         item2: false
//     }];    
// people = sortByKey(people, 'name');


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
  
//these are supposed to be in page.js but no good sitting there as there is almost nothing page related other than it belongs to main.html, maybe move them to main.html
function show_menu() { document.getElementById('menu').style.display = 'block'; }
function hide_menu() { document.getElementById('menu').style.display = 'none'; }
