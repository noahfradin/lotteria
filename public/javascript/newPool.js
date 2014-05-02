window.addEventListener('load',function(){

    var month = document.getElementById("month");
    var day = document.getElementById("day");
    var year = document.getElementById("year");
    var description = document.getElementById("ticketDescription");
    
    month.addEventListener("click", function(month) { deleteMonthDefault();});
    day.addEventListener("click", function(day) { deleteDayDefault();});
    year.addEventListener("click", function(year) { deleteYearDefault();});
    
    month.addEventListener("keyup", function(month) { addMonthDefault(month,day); });
    day.addEventListener("keyup", function(day) { addDayDefault(day,year); });
    year.addEventListener("keyup", function(year) { addYearDefault(year,description); });
    
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

function deleteMonthDefault(field){
   var month = document.getElementById("month");
    if(month.value = "MM"){
        month.value = "";    
    }
}
       
function deleteDayDefault(field){
   var day = document.getElementById("day");
    if(day.value = "DD"){
        day.value = "";    
    }
}

function deleteYearDefault(field){
   var year = document.getElementById("year");
    if(year.value = "YYYY"){
        year.value = "";    
    }
}

function addMonthDefault(month1,day){
    var month = document.getElementById("month");
    if(month.value.length ==2 && month.value != 'MM'){
//        day.value = "";
        day.focus();
    }
}

function addDayDefault(day,year){
     var day = document.getElementById("day");
     if(day.value.length ==2 && day.value != "DD"){
//        year.value = "";
        year.focus();
    }
}

function addYearDefault(year,description){
    var year = document.getElementById("year");
     if(year.value.length ==4 && year.value != "YYYY" ){
        description.focus();
    }
}
