//Lets get things going
$(document).ready(function() {

  var _host = 'http://'+ window.location.hostname;

  // donation stuff
  $('#js-donate-btn').click(function(e){
    e.preventDefault();
    $('#minfo, #dinfo').toggleClass('hide')
  })

  // Setup SockJS stuff
  var sock = new SockJS(_host +':9999/online');
  var online_users = $('#active-users');

  sock.onmessage = function(e) {
    online_users.text( e.data );
  };



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
      console.log('hi?');
      // console.log( file )
      done()
    }
  }


  var handleResponse = function(file, resp){
    if (resp.error){
      console.log( resp );
      console.error(resp.error);
      return;
    }

    console.log( 'uploaded: ', resp )

    var message = resp.message;
    if (message.type == 'image') return imageOverlay( message.url );
    
    if (message.type == 'url') {

      if ( message.url.indexOf('vimeo.com/') != -1){
        return vimeoOverlay( message.url )
      }

      else if ( message.url.indexOf('youtube.com/') != -1){
        return youtubeOverlay( message.url )
      }

      else if ( message.url.indexOf('youtu.be/') != -1){
        return youtubeOverlay( message.url )
      }

      else if ( message.url.indexOf('soundcloud.com/') != -1){
        return soundcloudOverlay( message.url )
      }

      else if ( message.url.indexOf('bandcamp.com/') != -1){
        return bandcampOverlay( message.url )
      }
      
      imageOverlay( message.url )
    }
  }

  // Handle uploading "Files"
  $("div#background, input.drop").dropzone({
    url: "/share", 
    success: handleResponse
  });

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
    // hide the donation view
    $('#dinfo').addClass('hide')
    $('#minfo').removeClass('hide')
  });
  //infoBox stuff

//content injection stuff
function imageOverlay(imageURL) {
  imageUrl = 'http://upload.wikimedia.org/wikipedia/en/4/4e/Shibe_Inu_Doge_meme.jpg';
  $("#overlayContent").attr('class', '').addClass('image')

  $("#overlayContent").html("<img src=" + "'" + imageURL + "'" + "/>");
  contentOpen();
};

//REmember to turn on all Autoplays. 
function youtubeOverlay(youtubeID, time) {
  //iframe has class of center and embedVideo
  $("#overlayContent").html('<div><iframe src="http://www.youtube.com/embed/' + youtubeID + '?rel=0&autoplay=1&t=' + time +'" frameborder="0" allowfullscreen class="center embedVideo"></iframe></div>');
  contentOpen();
};

function vimeoOverlay(vimeoID) {
  //iframe has class of center and embedVideo
  $("#overlayContent").html('<div><iframe src="http://player.vimeo.com/video/' + vimeoID + '?portrait=0&amp;color=ffffff&amp;autoplay=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen class="center embedVideo"></iframe></div>');
  contentOpen();
};

function soundcloudOverlay(soundcloudID) {
  //iframe has class of center and soundcloud
  $("#overlayContent").html('<div><iframe scrolling="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + soundcloudID + '&amp;color=666&amp;auto_play=true&amp;show_artwork=true" class="center soundcloud"></iframe></div>');
  contentOpen();
};


//bandcamp does not support autoplay out of the box, also consider switiching player style.
function bandcampOverlay(bandcampID) {
  //iframe has class of center and bandcamp
  $("#overlayContent").html('<div><iframe src="http://bandcamp.com/EmbeddedPlayer/album=' + bandcampID + '/size=large/bgcol=ffffff/linkcol=333333/notracklist=true/t=1/transparent=true/" seamless class="center bandcamp"></iframe></div>');
  contentOpen();
};



//Testing for layout
// youtubeOverlay( 'rE6pwmHHVb0', '39s' );
//vimeoOverlay('51510972');
//soundcloudOverlay('81288173');
//soundcloudOverlay('114212892');
//bandcampOverlay('1171202479');
//bandcampOverlay('456502597');

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
    $("#overlayContent").html('');            //Remove anything in the overlay content dov so that youtube, etc. wont continue playing on close if ended early.
  });







}); // end of document ready
