//Lets get things going
$(document).ready(function() {

$(".infoBox").hide();

$("#infoButton").click(function () {
	$(".infoBox").fadeIn("slow");
    });

$("#infoClose").click(function () {
	$(".infoBox").fadeOut("slow");
    });

}); // end of document ready


