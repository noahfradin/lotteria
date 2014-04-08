window.addEventListener('load',function(){

    var randomizeButton = document.getElementById("randomizeButton");
    var resetButton = document.getElementById("resetButton");
    var cancelButton = document.getElementById("cancelButton");
    var buyButton = document.getElementById("buyButton");
    var draws = document.getElementById("draws");
    var powerPlay = document.getElementById("powerPlay");
    
    randomizeButton.addEventListener("click", function() { randomizeNumbers();});
    resetButton.addEventListener("click", function() { resetNumbers();});
    draws.addEventListener("change",function(){ updateTotal();});
    powerPlay.addEventListener("change",function(){ updateTotal();});

},false);

function updateTotal(){
    console.log("hefddfg");
    var draws = document.getElementById("draws");
    var powerPlay = document.getElementById("powerPlay");   
    var totalAmount = document.getElementById("amount");
    var multiply = 2;
    if(powerPlay.checked == 1){
        multiply = 3;    
    }
    totalAmount.innerHTML = draws.item(draws.options.selectedIndex).value * multiply + ".00"; 
    
}

function buy(){   
    
}

function cancel(){
    
}

function resetNumbers(){
    var number1 = document.getElementById("number1");
    var number2 = document.getElementById("number2");
    var number3 = document.getElementById("number3");
    var number4 = document.getElementById("number4");
    var number5 = document.getElementById("number5");
    var powerball = document.getElementById("powerball");
    number1.value = "";
    number2.value = "";
    number3.value = "";
    number4.value = "";
    number5.value = "";
    powerball.value = "";
}

function randomizeNumbers(){
    var number1 = document.getElementById("number1");
    var number2 = document.getElementById("number2");
    var number3 = document.getElementById("number3");
    var number4 = document.getElementById("number4");
    var number5 = document.getElementById("number5");
    var powerball = document.getElementById("powerball");
    
    var repeated = true;
    number1.value = generateRandom(59);
    while(repeated){
        rand = generateRandom(59);
        if(number1.value != rand){
            number2.value = rand;
            repeated = false;   
        }
       
    }
    
    repeated = true;
    while(repeated){
        rand = generateRandom(59);
        if(number1.value != rand){
            if(number2.value != rand){
                number3.value = rand;
                repeated = false;     
            }   
        }  
    }
    
    repeated = true;
    while(repeated){
        rand = generateRandom(59);
        if(number1.value != rand){
            if(number2.value != rand){
                if(number3.value != rand){
                    number4.value = rand;
                    repeated = false;     
                }    
            }   
        }  
    }
    
    repeated = true;
    while(repeated){
        rand = generateRandom(59);
        if(number1.value != rand){
            if(number2.value != rand){
                if(number3.value != rand){
                    if(number4.value != rand){
                        number5.value = rand;
                        repeated = false;      
                    }  
                }    
            }   
        }  
    }
    

    
    powerball.value = generateRandom(35);
    
}

function generateRandom(top){
     return Math.floor((Math.random()*top)+1);
}