window.addEventListener('load',function(){

    var month = document.getElementById("month");
    var day = document.getElementById("day");
    var year = document.getElementById("year");
    month.addEventListener("click", function(month) { deleteMonthDefault();});
     day.addEventListener("click", function(day) { deleteDayDefault();});
     year.addEventListener("click", function(year) { deleteYearDefault();});
    
    month.addEventListener("change", function(month) { addMonthDefault();});
     day.addEventListener("change", function(day) { addDayDefault();});
     year.addEventListener("change", function(year) { addYearDefault();});

},false);

function deleteMonthDefault(field){
   var month = document.getElementById("month");
    if(month.value = "Month"){
        month.value = "";    
    }
}
       
function deleteDayDefault(field){
   var day = document.getElementById("day");
    if(day.value = "Day"){
        day.value = "";    
    }
}

function deleteYearDefault(field){
   var year = document.getElementById("year");
    if(year.value = "Year"){
        year.value = "";    
    }
}
   