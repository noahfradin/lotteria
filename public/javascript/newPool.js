window.addEventListener('load',function(){

    var month = document.getElementById("month");
    var day = document.getElementById("day");
    var year = document.getElementById("year");
    var description = document.getElementById("ticketDescription");
    month.addEventListener("click", function(month) { deleteMonthDefault();});
    day.addEventListener("click", function(day) { deleteDayDefault();});
    year.addEventListener("click", function(year) { deleteYearDefault();});
    
    month.addEventListener("keyup", function(month) { addMonthDefault(month,day);});
    day.addEventListener("keyup", function(day) { addDayDefault(day,year);});
    year.addEventListener("keyup", function(year) { addYearDefault(year,description);});

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
     if(year.value.length ==4 && day.value != "YYYY" ){
        description.focus();
    }
}
