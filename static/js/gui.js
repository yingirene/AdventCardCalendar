var today;
var xmasDay;

window.addEventListener("load", function() {
    today = new Date();
    xmasDay = new Date();
    xmasDay.setMonth(11);
    xmasDay.setDate(25);
    var daysLeft = new Date(xmasDay.getTime() - today.getTime())/1000/60/60/24;
    if(today.getMonth != 11) {
        $("#closedSign").show();
        $("#openSign").hide();
        $("#closedSign .countdownDisp").prepend(daysLeft);
    } else {
        $("#closedSign").hide();
        $("#openSign").show();
        $("#openSign .countdownDisp").prepend(daysLeft);
    }
}, false);

$("#calBtn").click(function(e) {
    $("#calendar").toggleClass("slide-up");
});

$("#subBtn").click(function(e) {
    $("#subtools").toggleClass("hidden");
});

$("#propBtn").click(function(e) {
    $("#properties").toggleClass("hidden");
});

$("#calendar li").click(function(e) {
    if(!($(this).hasClass("opened"))) {
        if(today.getDate() == $(this).text()) {
            $(this).addClass("opened");
        }
    }
});
