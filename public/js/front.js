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
    //imageOverlay(pushImageOut);                                     //cue overlay with the 'old' image
    youtubeOverlay('rE6pwmHHVb0');
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

//content injection stuff
function imageOverlay(imageURL) {
  $("#overlayContent").html("<img src=" + "'" + imageURL + "'" + "/>");
  contentOpen();
	};

function youtubeOverlay(youtubeID) {
  $("#overlayContent").html('<iframe src="http://www.youtube.com/embed/' + youtubeID + '?rel=0" frameborder="0" allowfullscreen></iframe>').css("z-index, 9999");
  contentOpen();
  };

function vimeoOverlay(vimeoID) {
  $("#overlayContent").html('<iframe src="http://player.vimeo.com/video/' + vimeoID + '?portrait=0&amp;color=ffffff" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>').css("z-index, 9999");
  contentOpen();
  };

function soundcloudOverlay(soundcloudID) {
  $("#overlayContent").html('<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + soundcloudID + '&amp;color=000&amp;auto_play=true&amp;show_artwork=true"></iframe>');
  contentOpen();
  };

  function bandcampOverlay(bandcampID) {
  $("#overlayContent").html('<iframe style="border: 0; width: 350px; height: 470px;" src="http://bandcamp.com/EmbeddedPlayer/album=' + bandcampID + '/size=large/bgcol=ffffff/linkcol=333333/notracklist=true/t=1/transparent=true/" seamless>');
  contentOpen();
  };


//content overlay stuff

function contentOpen(){
  $("#overlayContent").fadeIn("slow").css("z-index, 200");
  $(".overlayWhite").fadeIn("slow").css("z-index, 100");
  $("#contentClose").fadeIn("slow").css("z-index, 200");

}


$("#contentClose").click(function () {
	$("#overlayContent").fadeOut("slow");
	$(".overlayWhite").fadeOut("slow");
	$("#contentClose").fadeOut("slow");
    });







}); // end of document ready




