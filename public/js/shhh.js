//MASONARY
$(function(){

$('#container').masonry({
  itemSelector: '.graphbox'
});

});


d3.json("/api/shares", function(error, json) {
	if (error) return console.warn(error);
	data = json;

	console.log(data); // log it out!

	//get the most recent share for use below
	var recent = data[data.length-1]

	//set them into variables
	var shareMoment = moment(recent.created).fromNow();
	var shareType = recent.type;
	var mediaType = recent.mediatype;
	var lastURL = recent.url; // get current url

	$('.total').html('total shares: ' + data.length);
	$('.shareType').html('share type: '+ shareType);
	$('.mediaType').html('share mediaType: ' +  mediaType )
	$('.time').html('time since last share: '+ shareMoment);


	for (var i = data.length - 1; i >= 0; i--) {
		data[i]
		
	};


//Media Types Graph
nv.addGraph(function() {
  var chart = nv.models.pieChart()
      .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .showLabels(true);


    d3.select("#mediaTypesPie svg")
        .datum(exampleDataMT())
        .transition().duration(350)
        .call(chart);

  return chart;
});

//User Agents Graph
nv.addGraph(function() {
  var chart = nv.models.pieChart()
      .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .showLabels(true);
      

    d3.select("#userAgentPie svg")
        .datum(exampleDataUA())
        .transition().duration(350)
        .call(chart);

  return chart;
});


//Drops vs Links
nv.addGraph(function() {
  var chart = nv.models.discreteBarChart()
      .x(function(d) { return d.label })    //Specify the data accessors.
      .y(function(d) { return d.value })
      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
      .tooltips(false)        //Don't show tooltips
      .showValues(true)       //...instead, show the bar value right on top of each bar.
      .transitionDuration(350)
      ;

  d3.select('#dropLinkBar svg')
      .datum(exampleDataDL())
      .call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});

//Share Frequency
// http://nvd3.org/examples/cumulativeLine.html


function exampleDataDL() {
 return  [ 
    {
      key: "Drops Vs Links",
      values: [
        { 
          "label" : "Drops" ,
          "value" : 192
        } , 
        { 
          "label" : "Links" , 
          "value" : 309
        } 
      ]
    }
  ]

}



function exampleDataMT() {
  return  [
      { 
        "label": "Youtube",
        "value" : 29.765957771107
      } , 
      { 
        "label": "Vimeo",
        "value" : 10
      } , 
      { 
        "label": "SoundCloud",
        "value" : 32.807804682612
      } , 
      { 
        "label": "Text",
        "value" : 5.45946739256
      } , 
      { 
        "label": "Image",
        "value" : 100.19434030906893
      } 
    ];
}

function exampleDataUA() {
  return  [
      { 
        "label": "Firefox",
        "value" : 29.765957771107
      } , 
      { 
        "label": "Safari",
        "value" : 10
      } , 
      { 
        "label": "Chrome",
        "value" : 32.807804682612
      } , 
      { 
        "label": "Opera",
        "value" : 5.45946739256
      } , 
      { 
        "label": "Other",
        "value" : 100.19434030906893
      } 
    ];
}


})









