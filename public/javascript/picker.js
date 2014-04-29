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
    powerball.addEventListener("keyup",function(){ checkPowerball2();});
    

},false);

function moveInputCursor(number,numberMove){
    var number1 = document.getElementById("number1");
    var number2 = document.getElementById("number2");
    var number3 = document.getElementById("number3");
    var number4 = document.getElementById("number4");
    var number5 = document.getElementById("number5");
    var error = document.getElementById("error");
  
    if (number.value.length == 2) {
        if (!(/^\d+$/.test(number.value))){
            error.innerHTML ="Must input numbers";
            error.style.display='block';
            number.value = "";
            number.focus();
        }
        else if(parseInt(number.value) < 1 || parseInt(number.value) > 59){
            error.innerHTML = "Numbers must be between 1 and 59";
            error.style.display='block';
            number.value = "";
            number.focus();    
        }else{
            if(number.value == number1.value && number != number1){
                 error.innerHTML = "Non powerball numbers cannot be repeated";
                error.style.display='block';
                number.value = "";
                number.focus();      
            }
            else if(number.value == number2.value && number != number2){
                 error.innerHTML = "Non powerball numbers cannot be repeated";
                error.style.display='block';
                number.value = "";
                number.focus();      
            }
            else if(number.value == number3.value && number != number3){
                 error.innerHTML = "Non powerball numbers cannot be repeated";
                error.style.display='block';
                number.value = "";
                number.focus();      
            }
            else if(number.value == number4.value && number != number4){
                 error.innerHTML = "Non powerball numbers cannot be repeated";
                error.style.display='block';
                number.value = "";
                number.focus();      
            }
            else if(number.value == number5.value && number != number5){
                error.innerHTML = "Non powerball numbers cannot be repeated";
                error.style.display='block';
                number.value = "";
                number.focus();      
            }else{
               
                numberMove.focus(); 
                error.style.display='none';
            }      
        }
         
    }
}

function checkComplete(number){
     var error = document.getElementById("error");
    if (!(/^\d+$/.test(number.value))){
        error.innerHTML = "Must input numbers";
        error.style.display = 'block'
        number.value = "";
        number.focus();
    }
    else if(parseInt(number.value) < 1 || parseInt(number.value) > 59){
        error.innerHTML ="Numbers must be between 1 and 59";
          error.style.display = 'block'
        number.value = "";
        number.focus();    
    }else{
        if(number.value == number1.value && number != number1){
            error.innerHTML ="Non powerball numbers cannot be repeated";
              error.style.display = 'block'
            number.value = "";
            number.focus();      
        }
        else if(number.value == number2.value && number != number2){
            error.innerHTML ="Non powerball numbers cannot be repeated";
              error.style.display = 'block'
            number.value = "";
            number.focus();      
        }
        else if(number.value == number3.value && number != number3){
            error.innerHTML ="Non powerball numbers cannot be repeated";
              error.style.display = 'block'
            number.value = "";
            number.focus();      
        }
        else if(number.value == number4.value && number != number4){
            error.innerHTML ="Non powerball numbers cannot be repeated";
              error.style.display = 'block'
            number.value = "";
            number.focus();      
        }
        else if(number.value == number5.value && number != number5){
            error.innerHTML ="Non powerball numbers cannot be repeated";
              error.style.display = 'block'
            number.value = "";
            number.focus();      
        }  
        else{
            error.style.display = 'none';    
        }
    }
}

function checkPowerball(){
     var error = document.getElementById("error");
     var powerball = document.getElementById("powerball");
     
     if (!(/^\d+$/.test(powerball.value)))
     {
        error.innerHTML="Must input numbers";
         error.style.display = 'block'
        powerball.value = "";
        powerball.focus();
     }else if(parseInt(powerball.value) < 1 || parseInt(powerball.value) > 35){
        error.innerHTML = "Powerball number must be between 1 and 35";
         error.style.display = 'block'
        powerball.value = "";
        powerball.focus();    
     }
     else{
        error.style.display='none';   
    }
}

function checkPowerball2(){
     var powerball = document.getElementById("powerball");
     var error = document.getElementById("error");
     if (!(/^\d+$/.test(powerball.value)))
     {
        if(powerball.value!= ""){
            error.innerHTML="Must input numbers";
            error.style.display='block';
            powerball.value = "";
            powerball.focus();    
        }
        
     }else if(parseInt(powerball.value) < 1 || parseInt(powerball.value) > 35){
        error.innerHTML = "Powerball number must be between 1 and 35";
         error.style.display='block';
        powerball.value = "";
        powerball.focus();    
     }
    else{
        error.style.display='none';   
    }
}

function updateTotal(){
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