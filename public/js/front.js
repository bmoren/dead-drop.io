//Lets get things going
$(document).ready(function() {

// Dropzone stuff
  Dropzone.options.background = {
    maxFilesize: 100,
    parallelUploads: 1,
    uploadMultiple: false,
    addRemoveLinks: false,
    previewsContainer: '#no-previews',
    clickable: false,
    createImageThumbnails: false,
    acceptedFiles: 'image/*,text/plain,text/csv,text/x-markdown',
    accept: function(file, done) {
      // console.log( file )
      done()
    }
  }
  var myDropzone = new Dropzone("div#background", { url: "/share"});

  myDropzone.on("success", function(file, resp) {
    console.log( 'uploaded file', resp )
    //console.log('bmotest: ',resp.message.url)
    // create overlay here...

    //It seems like this gives me the /public/ and I dont need that...... 
    // it is also having a hard time with filenames with spaces
    // Dosent seem to be working, it goves the 'nope' / 404 not found error

    var pushImageOut = resp.message.url ;                             //get the URL of the 'old' image
    pushImageOut = pushImageOut.substring(8, pushImageOut.length);    //remove '/public/'
    contentOverlay(pushImageOut);                                     //cue overlay with the 'old' image
  })


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
function contentOverlay(theThing) {
  $("#overlayContent").html("<img src=" + "'" + theThing + "'" + "/>");
	$("#overlayContent").fadeIn("slow").css("z-index, 200");
	$(".overlayWhite").fadeIn("slow").css("z-index, 100");
	$("#contentClose").fadeIn("slow").css("z-index, 200");
	};

$("#contentClose").click(function () {
	$("#overlayContent").fadeOut("slow");
	$(".overlayWhite").fadeOut("slow");
	$("#contentClose").fadeOut("slow");
    });


//content overlay stuff

}); // end of document ready




