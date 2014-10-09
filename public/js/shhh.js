d3.json("/api/shares", function(error, json) {
	if (error) return console.warn(error);
	data = json;

	console.log(data); // log it out mango!

	var recent = data[data.length-1]

	var shareMoment = moment(recent.created).fromNow();
	var shareType = recent.type;
	var lastURL = recent.url; // get current url

	$('.total').html('total shares: ' + data.length);
	$('.current').html('last share type: '+ shareType);
	$('.time').html('time since last share: '+ shareMoment);

	for (var i=0; i<data.length; i++){
		return;
		console.log(data[i].user_agent);
		console.log(data[i].mimetype);
		console.log(data[i].type);
	}


})