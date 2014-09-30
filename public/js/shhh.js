d3.json("/shhh", function(error, json) {
	if (error) return console.warn(error);
	data = json;

	console.log(data); // log it out mango!

	//console.log('total db entries: ' + data.length); //total entries

	var shareMoment = moment(data[data.length-1].created, "YYYYMMDD").fromNow(); //what is going on with the super long time ago thing here?
	//console.log('shareMoment: ' + shareMoment);

	//console.log(data[data.length-1].url) 
	var lastURL = data[data.length-1].url; // get current url

	$('.total').html('total shares: ' + data.length);
	$('.current').html('Current Share URL: <a href="' + lastURL + '">' + lastURL + '</a>');
	$('.time').html('time since last share: '+ shareMoment);


	for (var i = data.length - 1; i >= 0; i--) {
		console.log(data[i].user_agent);
		console.log(data[i].mimetype);
		console.log(data[i].type);

	};






});


		