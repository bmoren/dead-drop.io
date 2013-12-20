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



  var handleResponse = function(file, resp){
    if (resp.error){
      console.log( resp );
      console.error(resp.error);
      return;
    }

    console.log( 'uploaded: ', resp )

    var message = resp.message;
    if (message.type == 'image') return imageOverlay( message.url );
    if (message.type == 'url') return imageOverlay( message.url );
    if (message.type == 'youtube') return youtubeOverlay( 'rE6pwmHHVb0' );
    if (message.type == 'vimeo') return vimeoOverlay( message.url );
    // ... etc

  }

  // Handle uploading "Files"
  myDropzone.on("success", handleResponse)


  //
  // Handle uploading "links"
  //
  $('#share-form').submit(function(e){
    e.preventDefault();
    var url = $(this).attr('action')
    $.post(url, $(this).serializeArray(), function(resp){
      handleResponse(null, resp);
    })
  })



//Hides
$("#infoBox").hide();
 $(".overlayWhite").hide();
 $(".overlayTrans").hide();
 $("#overlayContent").hide();
 $("#contentClose").hide();

//infoBox stuff
$("#infoButton").click(function (e) {
  e.preventDefault();
	$(".overlayTrans").fadeIn("slow").css("z-index, 100");
	$("#infoBox").fadeIn("slow").css("z-index, 200");
});

$("#infoClose").click(function (e) {
  e.preventDefault();
	$("#infoBox").fadeOut("slow");
	$(".overlayTrans").fadeOut("slow");
});
//infoBox stuff

//content injection stuff
function imageOverlay(imageURL) {
  imageUrl = 'http://upload.wikimedia.org/wikipedia/en/4/4e/Shibe_Inu_Doge_meme.jpg';
  $("#overlayContent").attr('class', '').addClass('image')

  $("#overlayContent").html("<img src=" + "'" + imageURL + "'" + "/>");
  contentOpen();
	};

function youtubeOverlay(youtubeID) {
  $("#overlayContent").attr('class', '').addClass('youtube')
  $("#overlayContent").html('<div class="position:relative; z-index:9999"><iframe src="http://www.youtube.com/embed/' + youtubeID + '?rel=0" frameborder="0" allowfullscreen></iframe></div>');
  contentOpen();
  };

function vimeoOverlay(vimeoID) {
  $("#overlayContent").attr('class', '').addClass('vimdeo')
  $("#overlayContent").html('<iframe src="http://player.vimeo.com/video/' + vimeoID + '?portrait=0&amp;color=ffffff" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>').css("z-index, 9999");
  contentOpen();
  };

function soundcloudOverlay(soundcloudID) {
  $("#overlayContent").attr('class', '').addClass('soundcloud')
  $("#overlayContent").html('<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + soundcloudID + '&amp;color=000&amp;auto_play=true&amp;show_artwork=true"></iframe>');
  contentOpen();
  };

  function bandcampOverlay(bandcampID) {
    $("#overlayContent").attr('class', '').addClass('bandcamp')
  $("#overlayContent").html('<iframe style="border: 0; width: 350px; height: 470px;" src="http://bandcamp.com/EmbeddedPlayer/album=' + bandcampID + '/size=large/bgcol=ffffff/linkcol=333333/notracklist=true/t=1/transparent=true/" seamless>');
  contentOpen();
  };


//content overlay stuff

function contentOpen(){
  $("#overlayContent").fadeIn("slow")
  $(".overlayWhite").fadeIn("slow")
  $("#contentClose").fadeIn("slow")

}


$("#contentClose").click(function (e) {
  e.preventDefault();
	$("#overlayContent").fadeOut("slow");
	$(".overlayWhite").fadeOut("slow");
	$("#contentClose").fadeOut("slow");
});







}); // end of document ready




