//Lets get things going
$(document).ready(function() {

//Hides
$("#infoBox").hide();
 $(".overlayWhite").hide();
 $(".overlayTrans").hide();
 $("#overlayContent").hide();
 $("#contentClose").hide();
//infoBox stuff
$("#infoButton").click(function () {
	$(".overlayTrans").fadeIn("slow").css("z-index, 100");
	$("#infoBox").fadeIn("slow").css("z-index, 200");
    });

$("#infoClose").click(function () {
	$("#infoBox").fadeOut("slow");
	$(".overlayTrans").fadeOut("slow");
    });
//infoBox stuff

//content overlay stuff
$("#testing").click(function () {
	$("#overlayContent").fadeIn("slow").css("z-index, 200");
	$(".overlayWhite").fadeIn("slow").css("z-index, 100");
	$("#contentClose").fadeIn("slow").css("z-index, 200");
	});

$("#contentClose").click(function () {
	$("#overlayContent").fadeOut("slow");
	$(".overlayWhite").fadeOut("slow");
	$("#contentClose").fadeOut("slow");
    });


//content overlay stuff

}); // end of document ready




