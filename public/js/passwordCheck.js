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
    var digitAlert = $("#passwordLength");
    var lengthAlert = $("#passwordLength");
    if(digitOK){
        digitAlert.color
    }
    $("#passwordLength").text("More than 8 characters");
    digitAlert.text("Minimum 1 digit");
    console.log("Länge:"+lengthOK+" Zahl:"+digitOK);
}