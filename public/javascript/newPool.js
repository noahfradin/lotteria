window.addEventListener('load',function(){
    
    var image = document.getElementById("eventImage");
    var imageHidden = document.getElementById("imageURL");
    var imageInput = document.getElementById("imageInput");
    
    var uploadImage = function() {
        var file = document.getElementById('imageInput').files[0];
        if (file) {
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            fd.append("img", file);

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    var json = JSON.parse(xhr.responseText);
                    image.src = json.url;
                    imageHidden.value = json.url;
                }
            };
            
            xhr.open("POST", "/upload/image");
            xhr.send(fd);
        }
    };
    
    imageInput.addEventListener("change", uploadImage, false);

},false);
