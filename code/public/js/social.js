function onSignIn(googleUser) {
    atLogin = true;
    var profile = googleUser.getBasicProfile();
    function send_to_server() {
      if(connected) {
        atLogin = true;
        ws.send(JSON.stringify({
          google_id: profile.getId(),
          facebook_id: "",
          name: profile.getName(),
          email: profile.getEmail(),
          avatar: profile.getImageUrl(),
          user_token: getCookie('wss')
        }))
        window.location.reload()
      } else {
        setTimeout(send_to_server, 100)
      }
    }
    send_to_server() //attempt send to server google has successfully logged in

    //post('/login', {}, "GET")
    //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //console.log('Name: ' + profile.getName());
    //console.log('Image URL: ' + profile.getImageUrl());
    //console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  function checkLoginState() {
    atLogin = true;
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected')
        FB.api('/me',{fields: 'id,name,email,picture'}, function(response) {   
          var res = response;     
          function send_to_server() { 
            if(connected) {
              ws.send(JSON.stringify({
                google_id: "",
                facebook_id: res.id,
                name: res.name,
                email: res.email,
                avatar: res.picture.data.url,
                user_token: getCookie('wss')
              }));
              window.location.reload()
            } else {
              setTimeout(send_to_server, 100)
            }
          }
          send_to_server() //attempt send to server google has successfully logged in
  
        });
      else
        FB.login();
    });
  }

  window.fbAsyncInit = function() {
    FB.init({appId      : '153121222067085',cookie     : true,xfbml      : true,version    : 'v2.12'});
    FB.AppEvents.logPageView();
  }