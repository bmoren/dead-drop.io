// Load libraries
var express = require('express'),
  fs = require('fs'),
  http = require('http'),
  sockjs = require('sockjs'),
	app = express(),
  messages = [],
  downloads = [],
  sockjs_port = 9999,
  port = 8999;

require('sugar') // yum!

// Setup Express Middleware
app.set('views', __dirname );
app.engine('html', require('ejs').renderFile); 

//
// Middleware to check for downloaded things
//
app.use(function(req, res, next){
  // ATTEMPTING TO DOWNLOAD SOME SHIT!!!

  // if (req.url.indexOf('/img/uploads/') != -1){
    // if (downloads.any( req.url )){
      // downloads.remove( req.url ) // user downloaded this now we can remove it!
      // actually remove the image
      // var url = path.normalize( __dirname + '/public' + req.url )
      // fs.unlink(url, function() {
      //   return next()
      // });
      // return next();
    // } 
    // return res.send('NOPE', 404);
  // }
  next();
})

app.use(express.bodyParser());
app.use(express.cookieParser('some secret'));

app.use(express.static('public'));

// Message Object
var Message = function(type, url){
  this.type = type || 'image';
  this.url = url || '/img/uploads/1st.jpg';
}

// Initialize our messages and download lists
messages.push( new Message('image', '/img/uploads/1st.jpg') )
downloads.push( messages[0].url )

//
// Upload Images method
// @param {object} file - a file upload object from: req.files.file for example
// @param {function} cb - a callback receives (error, new file url)
// 
var uploadImage = function(file, cb){
  var tmp_path = file.path;
  var img = '/public/img/uploads/' + file.name;
  var target_path = __dirname + img;
  fs.rename(tmp_path, target_path, function(err) {
    if (err) return cb(err)
    fs.unlink(tmp_path, function() {
      cb(null, img.replace('/public', '') )
    })
  })
}

//
// Add a new Message and receive a new message in response
// @returns response message
//
var addNew = function(type, url){
  var message = new Message(type, url)      // create a new url 'message'
  var response = messages.pop()             // grab the last 'message'
  messages.push(message)                    // add the new 'message'
  downloads.push( message.url )             // add to list of available downloads
  return response                           // return the previously added 'message'
}


//
// Share endpoint receives url or file uploads and does stuff
//
app.post('/share', function(req, res) {


  // User is trying to upload a url
  if (req.body.image){
    return res.json( { message: addNew('url', req.body.image) } )
  }

  // User is trying to upload a file (maybe?)
  if (!req.files || !req.files.file) return res.json({error: 'Something went wrong'});

  uploadImage( req.files.file, function(err, url){
    if (err) {
      console.log( err );
      return res.json({error: 'Something else went wrong'})      
    }
    return res.json( { message: addNew('image', url) } );
  });
});



//
// Start the webserver
//
app.listen(port, function(){
  console.log('App Started! on port', port )
})




// -----------------------------------
//
// SockJS - Realtime stuff below, argh!! ;-)
//

var online_users = 0;
var clients = {};
var online = sockjs.createServer({
  log: function(){}
});

var broadcast = function(message){
  for(key in clients) {
    if(clients.hasOwnProperty(key)) {
      clients[key].write( message );
    }
  }
}

online.on('connection', function(conn) {

  // someone joined, add them to the party!
  clients[conn.id] = conn;
  online_users++;

  // Tell all clients how many online users exist
  broadcast( online_users );

  // someone left, update all clients
  conn.on('close', function() {
    delete clients[conn.id];
    online_users--;
    broadcast( online_users );
  })

})


// start the WebSocket server stuff, yo

var server = http.createServer( app );

online.installHandlers(server, {prefix:'/online'});

server.listen(sockjs_port, '0.0.0.0', function(){
  console.log('SocketJS Started! on port', sockjs_port )
});


