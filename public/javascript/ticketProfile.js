window.addEventListener('load',function() {
  FB.Event.subscribe('message.send', function() {
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    fd.append("powerbucks", "25");

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var json = JSON.parse(xhr.responseText);
        reloadPowerbucks(json.powerbucks);
      }
    };
    
    xhr.open("POST", "/addbucks");
    xhr.send(fd);
  });
}, false);

function reloadPowerbucks(powerbucks) {
  var div = document.getElementById("powerbucks");
  div.innerHTML = "You have: $" +
      powerbucks +
      " PowerBucks&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
}