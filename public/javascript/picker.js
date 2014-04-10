window.addEventListener('load',function(){

    var randomizeButton = document.getElementById("randomizeButton");
    var resetButton = document.getElementById("resetButton");
    var cancelButton = document.getElementById("cancelButton");
    var buyButton = document.getElementById("buyButton");
    var draws = document.getElementById("draws");
    var powerPlay = document.getElementById("powerPlay");
    var number1 = document.getElementById("number1");
    var number2 = document.getElementById("number2");
    var number3 = document.getElementById("number3");
    var number4 = document.getElementById("number4");
    var number5 = document.getElementById("number5");
    var powerball = document.getElementById("powerball");
    
    
    randomizeButton.addEventListener("click", function() { randomizeNumbers();});
    resetButton.addEventListener("click", function() { resetNumbers();});
    draws.addEventListener("change",function(){ updateTotal();});
    powerPlay.addEventListener("change",function(){ updateTotal();});
    number1.addEventListener("keyup",function(){ moveInputCursor(number1,number2);});
    number2.addEventListener("keyup",function(){ moveInputCursor(number2,number3);});
    number3.addEventListener("keyup",function(){ moveInputCursor(number3,number4);});
    number4.addEventListener("keyup",function(){ moveInputCursor(number4,number5);});
    number5.addEventListener("keyup",function(){ moveInputCursor(number5,powerball);});
    number1.addEventListener("change",function(){ checkComplete(number1);});
    number2.addEventListener("change",function(){ checkComplete(number2);});
    number3.addEventListener("change",function(){ checkComplete(number3);});
    number4.addEventListener("change",function(){ checkComplete(number4);});
    number5.addEventListener("change",function(){ checkComplete(number5);});
    
    powerball.addEventListener("change",function(){checkPowerball();});
    

},false);

function moveInputCursor(number,numberMove){
    var number1 = document.getElementById("number1");
    var number2 = document.getElementById("number2");
    var number3 = document.getElementById("number3");
    var number4 = document.getElementById("number4");
    var number5 = document.getElementById("number5");
  
    if (number.value.length == 2) {
        if (!(/^\d+$/.test(number.value))){
            alert("Must input numbers");
            number.value = "";
            number.focus();
        }
        else if(parseInt(number.value) < 1 || parseInt(number.value) > 59){
            alert("Numbers must be between 1 and 59");
            number.value = "";
            number.focus();    
        }else{
            if(number.value == number1.value && number != number1){
                alert("Non powerball numbers cannot be repeated");
                number.value = "";
                number.focus();      
            }
            else if(number.value == number2.value && number != number2){
                alert("Non powerball numbers cannot be repeated");
                number.value = "";
                number.focus();      
            }
            else if(number.value == number3.value && number != number3){
                alert("Non powerball numbers cannot be repeated");
                number.value = "";
                number.focus();      
            }
            else if(number.value == number4.value && number != number4){
                alert("Non powerball numbers cannot be repeated");
                number.value = "";
                number.focus();      
            }
            else if(number.value == number5.value && number != number5){
                alert("Non powerball numbers cannot be repeated");
                number.value = "";
                number.focus();      
            }else{
                numberMove.focus();     
            }      
        }
         
    }
}

function checkComplete(number){
    if (!(/^\d+$/.test(number.value))){
        alert("Must input numbers");
        number.value = "";
        number.focus();
    }
    else if(parseInt(number.value) < 1 || parseInt(number.value) > 59){
        alert("Numbers must be between 1 and 59");
        number.value = "";
        number.focus();    
    }else{
        if(number.value == number1.value && number != number1){
            alert("Non powerball numbers cannot be repeated");
            number.value = "";
            number.focus();      
        }
        else if(number.value == number2.value && number != number2){
            alert("Non powerball numbers cannot be repeated");
            number.value = "";
            number.focus();      
        }
        else if(number.value == number3.value && number != number3){
            alert("Non powerball numbers cannot be repeated");
            number.value = "";
            number.focus();      
        }
        else if(number.value == number4.value && number != number4){
            alert("Non powerball numbers cannot be repeated");
            number.value = "";
            number.focus();      
        }
        else if(number.value == number5.value && number != number5){
            alert("Non powerball numbers cannot be repeated");
            number.value = "";
            number.focus();      
        }   
    }
}

function checkPowerball(){
     var powerball = document.getElementById("powerball");
    console.log(powerball.value);
     if (!(/^\d+$/.test(powerball.value)))
     {
        alert("Must input numbers");
        powerball.value = "";
        powerball.focus();
     }else if(parseInt(powerball.value) < 1 || parseInt(powerball.value) > 35){
        alert("Powerball number must be between 1 and 35");
        powerball.value = "";
        powerball.focus();    
     }
}

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