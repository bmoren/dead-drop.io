//Lets get things going
$(document).ready(function() {

$("#infoBox").hide();

$("buttonClick").click(function () {
	$(".showhidebox").fadeIn("slow");
    });

$(".showhideclose").click(function () {
	$(".showhidebox").fadeOut("slow");
});

// Dropzone stuff
var myDropzone = new Dropzone("div#background", { url: "/share"});


}); // end of document ready


