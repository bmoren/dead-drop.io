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

	$('.total').html('Total Shares: ' + data.length);
	$('.shareType').html('Type: '+ shareType); // This should be changed to reflect if it was a drop or a link
	$('.mediaType').html('Media Type: ' +  mediaType )
	$('.time').html('Last Share Was: '+ shareMoment);


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
nv.addGraph(function() {
  var chart = nv.models.lineChart()
                .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                .transitionDuration(350)  //how fast do you want the lines to transition?
                .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis
  ;

  chart.xAxis     //Chart x-axis settings
      .axisLabel('Time')
      .tickFormat(d3.format(',r'));

  chart.yAxis     //Chart y-axis settings
      .axisLabel('# of Shares')
      .tickFormat(d3.format('.02f'));

  /* Done setting the chart up? Time to render it!*/
  var myData = sinAndCos();   //You need data...

  d3.select('#sharesTime svg')    //Select the <svg> element you want to render the chart in.   
      .datum(myData)         //Populate the <svg> element with chart data...
      .call(chart);          //Finally, render the chart!

  //Update the chart when window resizes.
  nv.utils.windowResize(function() { chart.update() });
  return chart;
});

//Add Masonary last so no overlaps happen
$('#container').masonry({
  itemSelector: '.graphbox'
});



////++++++++++++++TEST DATA++++++++++++++++++


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

function sinAndCos() {
  var sin = []

  //Data is represented as an array of {x,y} pairs.
  for (var i = 0; i < 100; i++) {
    sin.push({x: i, y: Math.sin(i/10)});
  }

  //Line chart data should be sent as an array of series objects.
  return [
    {
      values: sin,      //values - represents the array of {x,y} data points
      key: 'Sine Wave', //key  - the name of the series.
      color: '#ff7f0e'  //color - optional: choose your own line color.
    }
  ];
}













