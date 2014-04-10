window.addEventListener('load',function(){

    var cardNumber = document.getElementById("cardNumber"); 
    var cardCVC = document.getElementById("cardCVC"); 
    var cardExpMonth = document.getElementById("cardExpMonth"); 
    var cardExpYear = document.getElementById("cardExpYear"); 
    
    cardNumber.addEventListener("change",function(){ checkCardNumber();});
    cardCVC.addEventListener("change",function(){ checkCardCVC();});
    cardExpMonth.addEventListener("change",function(){ checkCardExpMonth();});
    cardExpYear.addEventListener("change",function(){ checkCardExpYear();});
},false);

function checkCardNumber(){
    var cardNumber = document.getElementById("cardNumber");
    if (!(/^\d+$/.test(cardNumber.value))){
        alert("Must input numbers");
        cardNumber.value = "";
        cardNumber.focus();
    }
}

function checkCardCVC(){
    var cardCVC = document.getElementById("cardCVC");
    if (!(/^\d+$/.test(cardCVC.value))){
        alert("Must input numbers");
        cardCVC.value = "";
        cardCVC.focus();
    }
}

function checkCardExpMonth(){
    var checkCardExpMonth = document.getElementById("checkCardExpMonth");
    if (!(/^\d+$/.test(checkCardExpMonth.value))){
        alert("Must input numbers");
        checkCardExpMonth.value = "";
        checkCardExpMonth.focus();
    }
}

function checkCardExpYear(){
    var checkCardExpYear = document.getElementById("checkCardExpYear");
    if (!(/^\d+$/.test(checkCardExpYear.value))){
        alert("Must input numbers");
        checkCardExpYear.value = "";
        checkCardExpYear.focus();
    }
}