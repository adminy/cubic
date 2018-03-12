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

  function signOut() {
    if(ws) {
      ws.send(JSON.stringify({logout: getCookie('wss')}))
      eraseCookie('wss')
    }
    if(typeof gapi !== 'undefined' && gapi.auth) {
      gapi.auth.signOut();
      console.log('Logged out of Google')
    }
    if(FB) {
      FB.getLoginStatus(function(response) {
        if (response && response.status === 'connected') {
            FB.logout(function(response) {
                console.log('Logged out of Facebook')
            });
        }
      });
    }
    window.location.reload()
  }

  function login_page() {
    (function (d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) { return; } js = d.createElement(s); js.id = id; js.src = 'https://connect.facebook.net/en_US/sdk.js'; fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'facebook-jssdk'));
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    script.defer = true;
    document.getElementsByTagName('head')[0].appendChild(script);
    load_page('login.html', document.body)
  }
  