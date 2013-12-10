// Load libraries
var express = require('express'),
	app = express(),
  port = 8999;

// Setup Express Middleware
app.set('views', __dirname );
app.engine('html', require('ejs').renderFile);
app.use(express.bodyParser());
app.use(express.cookieParser('some secret'));
app.use(express.static('public'));

var message = "empty";



app.post('/share', function(req, res) {
  var data = req.body;
  //return res.send('thanks for sharing');

  var nextmessage = message;

  message = data.image;

  //res.send( message);
  res.send( '<img src="' + nextmessage + '"/ >');
});




// -----------------------------------
app.listen(port, function(){
	console.log('App Started! on port', port)
})