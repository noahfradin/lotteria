window.addEventListener('load',function(){

    var search = document.getElementById("chatText");
    search.addEventListener("keyup",function(){ filter();});
    search.addEventListener("click",function(){removeDefault();});
    var noPool = document.getElementById("noPool");
    noPool.style.display = 'none';

},false);

function filter(){
    var search = document.getElementById("chatText");
    var tickets = document.getElementById("tickets");
    
    var items = tickets.getElementsByTagName("li");
    var allEmpty = 1;
    
    for (var i = 0; i < items.length; ++i) {
        if(search.value!= ''){
            h2 = items[i].getElementsByTagName("h2");
            if( h2[0].innerHTML.toLowerCase().indexOf(search.value.toLowerCase()) == -1){
                items[i].style.display = 'none'    
            }
            else{
                items[i].style.display = 'block'   
                allEmpty = 0;
            }
        }
        else{
            items[i].style.display = 'block'   
            allEmpty = 0;
        }
        
        
    }
    if (allEmpty === 1 ){
        var noPool = document.getElementById("noPool");
        noPool.style.display = 'block';       
    }
    else{
        var noPool = document.getElementById("noPool");
        noPool.style.display = 'none';      
    }
    
}

function removeDefault(){
    var search = document.getElementById("chatText");
    if (search.value == 'Find a Pool and Join the Fun!'){
        search.value = '';    
    }
}