window.addEventListener("load", function() {
    var today = new Date();
    var xmasDay = new Date();
    xmasDay.setMonth(11);
    xmasDay.setDate(25);
    var daysLeft = new Date(xmasDay.getTime() - today.getTime())/1000/60/60/24;
    if(today.getMonth == 11) {
        $("#closedSign").show();
        $("#openSign").hide();
        $("#closedSign").children()[1].prepend(daysLeft);
    } else {
        $("#closedSign").hide();
        $("#openSign").show();
        $("#openSign").children()[0].prepend(daysLeft);
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

$("#calendar li").one("click", function(e) {
    $(this).addClass("opened");
});
