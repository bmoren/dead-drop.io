// Load libraries
var express = require('express'),
  fs = require('fs'),
  exec = require('child_process').exec,
  http = require('http'),
  path = require('path'),
  request = require('request'),
  // db = require('./db'),
  sockjs = require('sockjs'),
  async = require('async'),
	app = express(),
  messages = [],
  garbage = [],
  sockjs_port = 9999,
  port = 8999;

require('sugar') // yum!

// rebuild uploads directory
exec('./rebuild.sh')

// faux-guid generation, bwahaha
var s4 = function() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
}
var guid = function(){
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

// Setup Express Middleware
app.set('views', __dirname +'/public/views' );
app.engine('html', require('ejs').renderFile); 

//
// Middleware to clean out the img/uploads garbage
//
app.use(function removeGarbage(req, res, next){
  if (req.url.indexOf('/img/uploads/') != -1 && garbage.length){
    var fns = []
    garbage.each(function(item, i){
      fns.push(function(done){
        // console.log('- del', item)
        garbage.remove(item)
        fs.unlink(item, done)
      })
    })
    async.parallel(fns, function(err, x){
      if (err) console.log(err)
      next()
    })
  } else {
    next()
  }
})

//
// Middleware to serve files and then add them to the garbage collection
//
app.use(function serveFile(req, res, next){
  if (req.url.indexOf('/img/uploads/') != -1){
    var url = path.normalize( __dirname + '/public' + req.url )
    // console.log('+ add', url, 'to garbage collection')
    garbage.push(url)
  }
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

//
// Upload Images method
// @param {object} file - a file upload object from: req.files.file for example
// @param {function} cb - a callback receives (error, new file url)
// 
var uploadImage = function(file, cb){
  var tmp_path = file.path;
  var ext = path.extname( file.name )

  var img = '/public/img/uploads/' + guid() + ext;
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
  return response                           // return the previously added 'message'
}


//
// Share endpoint receives url or file uploads and does stuff
//
app.post('/share', function(req, res) {

  // User is trying to upload a url
  if (req.body.image){
    // perform head request here
    request.head(req.body.image, function(err, resp, body){
      console.log('---------------');
      console.log( err, resp.statusCode );
      if (resp.statusCode > 299){
        return res.json({ error: "The URL you are trying to share is nonexistent, find something <i>real</i> to share." });
      }
      return res.json( { message: addNew('url', req.body.image) } )
    })
  } else {
    // User is trying to upload a file (maybe?)
    if (!req.files || !req.files.file) return res.json({error: 'Something went wrong'});

    uploadImage( req.files.file, function(err, url){
      if (err) {
        console.log( err );
        return res.json({error: 'Something else went wrong'})      
      }
      var type = 'text';
      if (req.files.file.type.indexOf('image/') != -1){
        type = 'image'
      }
      var previous = addNew(type, url);

      if (previous.type == 'text'){
        fs.readFile(__dirname + '/public'+ previous.url, 'utf8', function(err, data){
          if (err){
            return res.json({error: 'unable to read the text file, oops'})
          }
          previous.url = data;
          return res.json( { message: previous } );
        });
      } else {
        return res.json( { message: previous } );
      }
    });
  }

});

app.get('/test', function(req, res){
  return res.json({test:'ok'})
})


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


