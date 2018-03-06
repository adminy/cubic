function onSignIn(googleUser) {
    page.atLogin = true;
    var profile = googleUser.getBasicProfile();
    function send_to_server() {
      if(ws) {
        ws.send(JSON.stringify({
          google_id: profile.getId(),
          facebook_id: "",
          name: profile.getName(),
          email: profile.getEmail(),
          avatar: profile.getImageUrl(),
          login_time: new Date().getTime() / 1000
        }))
        //MAKE_LOADING_PAGE!....................................................................................................................................
        //TRANSITION_TO_MAIN_PAGE!..............................................................................................................................
        load_page('main.html', document.body)
      } else setTimeout(send_to_server, 100)
    }
    send_to_server() //attempt send to server google has successfully logged in
  }

  function checkLoginState() {
    page.atLogin = true;
    FB.getLoginStatus(function(response) {
      if(response.status === 'connected')
        FB.api('/me',{fields: 'id,name,email,picture'}, function(response) {   
          var res = response;
          function send_to_server() { 
            if(ws) {
              ws.send(JSON.stringify({
                google_id: "",
                facebook_id: res.id,
                name: res.name,
                email: res.email,
                avatar: res.picture.data.url,
                login_time: new Date().getTime() / 1000
              }))
              //MAKE_LOADING_PAGE!....................................................................................................................................
              //TRANSITION_TO_MAIN_PAGE!..............................................................................................................................
              load_page('main.html', document.body)
            } else setTimeout(send_to_server, 100)
          }
          send_to_server() //attempt send to server google has successfully logged in
        })
      else
        FB.login()
    });
  }

  window.fbAsyncInit = function() {
    FB.init({appId      : '153121222067085',cookie     : true,xfbml      : true,version    : 'v2.12'})
    FB.AppEvents.logPageView()
  }