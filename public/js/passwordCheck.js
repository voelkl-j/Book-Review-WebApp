$(document).ready(function () {
  $("#password").keyup(passwordCheck);
});

function passwordCheck(Event){
    var input= Event.target.value;
    var lengthOK = false;
    var digitRegEx = /[0-9]+/;
    var digitOK = digitRegEx.test(input);
    if(input.length > 8){
        lengthOK = true;
    }
    
    showPasswordstrength(input, lengthOK, digitOK);
}

function showPasswordstrength(input, lengthOK, digitOK){ 
    var field=  $("#password");
    var digitAlert = $("#passwordDigit");
    var lengthAlert = $("#passwordLength");
    digitAlert.removeClass("text-success");
    digitAlert.addClass("text-danger");
    lengthAlert.removeClass("text-success");
    lengthAlert.addClass("text-danger");
    if(digitOK){
        digitAlert.removeClass("text-danger");
        digitAlert.addClass("text-success");
    }
    if(lengthOK){
        lengthAlert.removeClass("text-danger");
        lengthAlert.addClass("text-success");
    }
    lengthAlert.text("More than 8 characters");
    digitAlert.text("Minimum 1 digit");
    console.log("Länge:"+lengthOK+" Zahl:"+digitOK);
}