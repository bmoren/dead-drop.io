var DEFAULT_INPUT_VAL = 'paste link or drag and dead-drop';

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
  var last_share = {}

  sock.onmessage = function(e) {
    online_users.text( e.data );
  };



  // Dropzone stuff
  Dropzone.options.dropzone = {
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


  var handleResponse = function(file, resp){
    if (resp.error){
      console.log( resp );
      console.error(resp.error);
      return;
    }

    console.log( 'uploaded: ', resp )

    var message = resp.message;
    if (message.type == 'image') return imageOverlay( message.url );

    if (message.type =='text') return textOverlay(message.url);
    
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
      message.url = addHttp( message.url );
      imageOverlay( message.url )
    }
  }

  // Handle uploading "Files"
  $("#dropzone").dropzone({
    url: "/share", 
    success: handleResponse
  });

  //
  // Handle uploading "links"
  //
  $('#share-form').submit(function(e){
    e.preventDefault();
    var url = $(this).attr('action')
    var data = $(this).serializeArray()
    
    if (data[0].value == DEFAULT_INPUT_VAL){
      return false;
    }


    $.post(url, data, function(resp){

      if (resp.error){
        flashMessage(resp.error);
      }else{
        handleResponse(null, resp);
      }
    })
  })

  //Hides
  $("#infoBox").hide();
  $(".overlayWhite").hide();
  $(".overlayTrans").hide();
  $("#overlayContent").hide();
  $("#contentClose").hide();
  $('#flashMessage').hide();
  $('#flashClose').hide();
  $(".overlayNoClick").hide();

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



  ////URL Parsers for Media ///

  function youtube_parser(url){
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match&&match[7].length==11){
          return match[7];
      }else{
          return false;
      }
  }

  function vimeo_parser(url){
    var regExp = /(http|https):\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
    var match = url.match(regExp);
    if (match){
        return match[3]
    }else{
        return false;
    }
  }

  SC.initialize({
    client_id: 'e815582cffbab7cc96424fedf41a1c6d'
  });

  function soundcloud_parse(url, cb){
    SC.oEmbed(url, { auto_play: true, maxheight: 166, iframe: true, }, function(oEmbed) {
      //console.log('oEmbed response: ' + oEmbed);
      cb(oEmbed)
    });
  }

  function addHttp(url) {
    if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = "http://" + url;
    }
    return url;
  }

  ///////Embed generation functions & content injection stuff
  function imageOverlay(imageURL) {
    $("#overlayContent").attr('class', '').addClass('image')
    contentOpen("<img src=" + "'" + imageURL + "'" + "/>");
  };

    function textOverlay(textURL) {
    $("#overlayContent").attr('class', '').addClass('text')
    contentOpen( '<textarea class="textArea center">' + textURL +  '</textarea>', 'text' );
  };

  function youtubeOverlay(youtubeURL) {

    var youtubeID = youtube_parser(youtubeURL);

    if (youtubeID == false) {
      alert("youtube id is no good buddy!");
    }else{
    //iframe has class of center and embedVideo
    contentOpen('<div><iframe src="http://www.youtube.com/embed/' + youtubeID + '?rel=0&autoplay=1" frameborder="0" allowfullscreen class="center embedVideo"></iframe></div>');
    };  
  };

  function vimeoOverlay(vimeoURL) {

    var vimeoID = vimeo_parser(vimeoURL);

    if (vimeoID == false) {
      alert("vimeo id is no good buddy!");
    };

    //iframe has class of center and embedVideo
    contentOpen('<div><iframe src="http://player.vimeo.com/video/' + vimeoID + '?portrait=0&amp;color=ffffff&amp;autoplay=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen class="center embedVideo"></iframe></div>');
  };

  function soundcloudOverlay(soundcloudURL) {
    soundcloud_parse(soundcloudURL, function(oEmbed) {
      console.log(oEmbed);
      //iframe has class of center and soundcloud
      contentOpen('<div class="soundcloud center">' + oEmbed.html + '</div>');

    })
  };

  //BANDCAMP ON HOLD UNTIL DEVELOPER KEYS BECOME AVAILABLE!
  // //bandcamp does not support autoplay out of the box, also consider switiching player style.
  // function bandcampOverlay(bandcampID) {
  //   //iframe has class of center and bandcamp
  //   $("#overlayContent").html('<div><iframe src="http://bandcamp.com/EmbeddedPlayer/album=' + bandcampID + '/size=large/bgcol=ffffff/linkcol=333333/notracklist=true/t=1/transparent=true/" seamless class="center bandcamp"></iframe></div>');
  //   contentOpen();
  // };

  //Testing for layout
  //youtubeOverlay( 'rE6pwmHHVb0');
  //vimeoOverlay('51510972');
  //soundcloudOverlay('81288173');
  //soundcloudOverlay('114212892');
  //bandcampOverlay('1171202479');
  //bandcampOverlay('456502597');

  //flashMessage('this is a testthis is a testthis is a testthis is a testthis is a testthis is a testthis is a testthis is a testthis is a testthis is a testthis is a testthis is a testthis is a testthis is a testthis is a testthis is a test');

  //content overlay stuff
  function contentOpen(content, type){
    $("#overlayContent").html(content)
    $("#overlayContent").fadeIn("slow");
    $(".overlayWhite").fadeIn("slow");
    if (type != 'text') {
      $(".overlayNoClick").fadeIn("slow");
    };
    $("#contentClose").fadeIn("slow");
  };

  $("#contentClose").click(function (e) {
    e.preventDefault();
  	$("#overlayContent").fadeOut("slow");
  	$(".overlayWhite").fadeOut("slow");
    $(".overlayNoClick").fadeOut("slow");   //makes the user unable to click to pause videos or songs or drag images off the screen (this is not very 'real' but it will prevent most......)
  	$("#contentClose").fadeOut("slow");
    $("#overlayContent").html('');            //Remove anything in the overlay content dov so that youtube, etc. wont continue playing on close if ended early.
    $('#drop_input').val( DEFAULT_INPUT_VAL );
    $('#dropzone').removeClass('active');
  });

  //flash message
  function flashMessage(err){
    $('#flashMessage').fadeIn("slow");
    $('#flashClose').fadeIn("slow");
    $(".overlayTrans").fadeIn("slow");
    $('#flashErr').html(err);
  };

  $('#flashClose').click(function (e) {
    $('#flashMessage').fadeOut("slow");
    $('#flashClose').fadeOut("slow");
    $(".overlayTrans").fadeOut("slow");
  });

  $('#background')
  .on('dragenter', function(e){
    $("#dropzone").addClass('active')
  })
  .on('dragleave', function(e){
    return false; // fix for event
  })

  $('#dropzone').on('drop', function(e){
    $('#dropzone').removeClass('active')
  })

  $('body')
  .on('dragleave', function(e){
    $("#dropzone").removeClass('active')
  })

//Dragable
  $('#drop_input')
  .val( DEFAULT_INPUT_VAL ) // set the default input value at page load
  .click(function(e){
    var val = $(this).val()
    if (val == DEFAULT_INPUT_VAL){
      $(this).val('');
    }
  })
  .blur(function(e){
    var val = String($(this).val()).trim()
    if (val == ''){
      $(this).val( DEFAULT_INPUT_VAL );
    }
  })



}); // end of document ready
