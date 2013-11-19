var express = require('express'),
	app = express()

app.set('views', __dirname );
app.engine('html', require('ejs').renderFile);
app.use(express.bodyParser());

var message = "empty";

var handleShare = function(req, res) {
	var data = req.body;
	//return res.send('thanks for sharing');

	var nextmessage = message;

	message = data.image;

	//res.send( message);
	res.send( '<img src="' + nextmessage + '"/ >');
}

app.get('/', function(req, res){
  res.render('index.html')
})

app.post('/share', handleShare);

app.listen(8999, function(){
	console.log('App Started!')
})