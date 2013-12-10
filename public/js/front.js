//Lets get things going
$(document).ready(function() {

$(".infoBox").hide();

$("buttonClick").click(function () {
	$(".showhidebox").fadeIn("slow");
    });

$(".showhideclose").click(function () {
	$(".showhidebox").fadeOut("slow");
    });

}); // end of document ready


