//Lets get things going
$(document).ready(function() {

  $(".infoBox").hide();

  $("buttonClick").click(function () {
  	$(".showhidebox").fadeIn("slow");
      });

  $(".showhideclose").click(function () {
  	$(".showhidebox").fadeOut("slow");
  });

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
    // create overlay here...
  })


}); // end of document ready


