// Common javascript utilities, mostly facebook linkage

// this will run on every page it's included in, setting up fb
var fbRoot = document.createElement("div");
fbRoot.id = "fb-root";
document.body.appendChild(fbRoot);
window.fbAsyncInit = function() {
  FB.init({
    appId      : '220803898117351',
    status     : true,
    xfbml      : true
  });
  // facebook user login/logout events
  FB.Event.subscribe('auth.authResponseChange', function(response) {
    if (response.status === 'connected') {
      // redirect to the user page?
    } else if (response.status === 'not_authorized') {
      // In this case, the person is logged into Facebook, but not into the app
    } else {
      // In this case, the person is not logged into Facebook
    }
  });
};
(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "http://connect.facebook.net//en_US/all/debug.js";
  fjs.parentNode.insertBefore(js, fjs);
} (document, 'script', 'facebook-jssdk'));