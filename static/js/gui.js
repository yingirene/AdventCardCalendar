var today;
var xmasDay;

window.addEventListener("load", function() {
    today = new Date();
    xmasDay = new Date();
    xmasDay.setMonth(11);
    xmasDay.setDate(25);
    var daysLeft = Math.round(new Date(xmasDay.getTime() - today.getTime())/(1000*60*60*24));
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
    if($("#calendar").hasClass("slide-up")) {
        $(this).text("Show Calendar");
    } else {
        $(this).text("Hide Calendar");
    }
});

$("#subBtn").click(function(e) {
    $("#subtools").toggleClass("hidden");
    $(".container").toggleClass("expand");
    $("#center").toggleClass("expand");
    $("#subBtn").toggleClass("expand");
    if($("#subtools").hasClass("hidden")) {
        $(this).html("<i class='fa fa-caret-right' aria-hidden='true'></i>");
    } else {
        $(this).html("<i class='fa fa-caret-left' aria-hidden='true'></i>");
    }
});

$("#calendar li").click(function(e) {
    if(!($(this).hasClass("opened"))) {
        if(today.getDate() != $(this).text()) {
            $(this).addClass("opened");
            var dayList = document.getElementsByClassName($(this).text());
            for(var i = 0; i < dayList.length; i++) {
                dayList[i].className += " revert";
            }
        }
    }
});

$("#stampBtn").click(function(e) {
    $(".otherTools").addClass("hidden");
    $("#stampDiv").toggleClass("hidden");
});

$("#bgBtn").click(function(e) {
    $(".otherTools").addClass("hidden");
    $("#bgDiv").toggleClass("hidden");
});
