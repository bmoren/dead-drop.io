//
// On page load, create a new Shhh object and initialize it
//
$(function(){

  var shhh = window.shhh = new Shhh();
  shhh.init()

})



//
// Shhh object
//
var Shhh = function(){
  this.data = null; // the current timeframe data
  this.cacheData = {}; // cached timeframe data
  this.timeframe = 1; // current timeframe, (number of months worth of data from today)
}

//
// Initialize the charts and things
//
Shhh.prototype.init = function(){
  var self = this;
  this.setTimeframe()     // defaults to 1 (last month)
  this.displayMainStats() // displays the top section of stats
  this.displayCharts()    // displays the time range'd charts n stuff

  $('#time-select').on('change', function(){
    self.setTimeframe( $(this).val() )
    self.displayCharts()
  })

  $('#refresh').on('click', function(){
    self.cacheData = {}
    self.displayMainStats() // displays the top section of stats
    self.displayCharts()    // displays the time range'd charts n stuff
  })
}

//
// Diaplays the top stats (total shares, current share)
//
Shhh.prototype.displayMainStats = function(){
  this.getStats(function(err, stats){
    if (err || !stats) return console.log(err)

    var recent = stats.recent;
    //set them into variables
    var shareMoment = moment(recent.created).fromNow();
    var shareType = recent.type;
    var mediaType = recent.mediatype;
    var lastURL = recent.url; // get current url

    $('.total').html(stats.shares)
    $('.shareType').html('Type: '+ shareType)
    $('.mediaType').html('Media Type: ' +  mediaType )
    $('.time').html('Last Share Was: '+ shareMoment)

  })
}

//
// Displays the rest of the chart data based on the current timeframe
//
Shhh.prototype.displayCharts = function(){
  var self = this
  this.getData(function(err, data){
    self.showCharts()
    $('.totaltf').text(data.orig_data.length)
  })
}


Shhh.prototype.showCharts = function(){
  var self = this;

  //Media Types Graph
  nv.addGraph(function() {
    var chart = nv.models.pieChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .showLabels(true)
        .valueFormat( d3.format(',.0f') )

    d3.select("#mediaTypesPie svg")
        .datum(self._mediaTypeData())
        .transition().duration(350)
        .call(chart);

    return chart;
  })

  //User Agents Graph
  nv.addGraph(function() {
    var chart = nv.models.pieChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .showLabels(true)
        .valueFormat( d3.format(',.0f') )

    d3.select("#userAgentPie svg")
        .datum(self._userAgentsData())
        .transition().duration(350)
        .call(chart);

    return chart;
  });


  //Drops vs Links
  nv.addGraph(function() {

    var chart = nv.models.discreteBarChart()
        .x(function(d) { return d.label })    //Specify the data accessors.
        .y(function(d) { return d.value })
        .tooltips(false)        //Don't show tooltips
        .showValues(true)       //...instead, show the bar value right on top of each bar.
        .transitionDuration(350)   
        .valueFormat( d3.format(',.0f') )

    chart.yAxis
      .tickFormat( d3.format(',.0f') )

    d3.select('#dropLinkBar svg')
        .datum(self._dropLinksData())
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });

  //Share Frequency
  // http://nvd3.org/examples/cumulativeLine.html
  nv.addGraph(function() {
    // var chart = nv.models.lineChart()
    //     .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
    //     .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
    //     .transitionDuration(350)  //how fast do you want the lines to transition?
    //     .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
    //     .showYAxis(true)        //Show the y-axis
    //     .showXAxis(true)        //Show the x-axis
    

    // chart.xAxis     //Chart x-axis settings
    //     .axisLabel('Date')
    //     // .tickFormat(d3.format(',r'));

    // chart.yAxis     //Chart y-axis settings
    //     .axisLabel('# of Shares')
    //     // .tickFormat(d3.format('.02f'));

    var chart = nv.models.lineChart()
      .margin({left:100, right:60, bottom:60, top:40})
      .useInteractiveGuideline(true)
      .transitionDuration(350)
      .showLegend(false)
      .showYAxis(true)
      .showXAxis(true)
      .x(function(d) { return d[0] })
      .y(function(d) { return d[1] })

    chart.xAxis
      .axisLabel('Date')
      .tickFormat(function(d, x, y , z){
        return d3.time.format('%x')(new Date(d))
      })

    chart.yAxis
      .axisLabel('# Shares')
      .tickFormat(function(d){
        return d
      })

    d3.select('#sharesTime svg')    //Select the <svg> element you want to render the chart in.   
        .datum(self._numSharesData())         //Populate the <svg> element with chart data...
        .call(chart);          //Finally, render the chart!

    //Update the chart when window resizes.
    nv.utils.windowResize(function() { chart.update() });
    return chart;
  });
}



//
// Set the timeframe for reports, eg: 3 (last 3 months)
// 
Shhh.prototype.setTimeframe = function(time){
  var t = (time) ? time : (this.helpers.qs('t') || 1)
  this.timeframe = t;

  if (time){
    history.pushState(null, null, '?t='+ time)
  }
  $('#time-select option').attr('selected', false)
  $('#time-select option[value="'+ t +'"]').attr('selected', 'selected')

  // update UI
  var text = $('#time-select option[selected="selected"]').text()
  $('.timeframe').text( text )

  return t;
}


Shhh.prototype.getData = function(refresh, cb){
  if (!cb){
    cb = refresh || function(){}
    refresh = false
  }
  var t = this.timeframe;
  // try and get cached data first...
  var cache = this.cacheData['data-'+ t]
  if (cache && !refresh) {
    this.data = cache
    return cb(null, cache)
  }
  // otherwise, get the data from the server and cache it!
  var self = this;  
  d3.json("/api/shares/"+ t, function(error, data) {
    if (error) return console.warn(error);
    var processedData = self.processData( data );
    self.cacheData['data-'+ t] = processedData
    self.data = processedData;
    cb(error, processedData)
  })

}


Shhh.prototype.getStats = function(cb){
  d3.json('/api/stats', cb);
}


//
// Helper methods
//
Shhh.prototype.helpers = {};

//
// returns the value of key from the current url query params
//
Shhh.prototype.helpers.qs = function(key){
  var x = (window.location.search.substring(1)).split('&')
  for (var i=0; i<x.length; i++) {
    var kv = x[i].split('=')
    if(kv[0] == key) return kv[1]
  }
  return undefined
}


//
// Chart Data methods
//

Shhh.prototype.processData = function(data){
  var results = {
    user_agents: [], // generated from data
    media_types: [
      { label: "Youtube",     value : 0 },
      { label: "Vimeo",       value : 0 },
      { label: "SoundCloud",  value : 0 },
      { label: "Text",        value : 0 },
      { label: "Image",       value : 0 }
    ],
    drop_vs_links: [{
      key: "Drops Vs Links",
      values: [
        { label : "Drops" , value : 0 },
        { label : "Links" , value : 0 }
      ]
    }],
    num_shares: {
      values: [],
      key: 'Shares'
    },
    orig_data: data
  };

  var _tmp = {};

  data.forEach(function(share, i){
    // update values for drop vs link
    if (share.dropped == true) {
      results.drop_vs_links[0].values[0].value++
    } else {
      results.drop_vs_links[0].values[1].value++
    }

    // update values for media types
    if (share.mediatype == 'youtube')     results.media_types[0].value++
    if (share.mediatype == 'vimeo')       results.media_types[1].value++
    if (share.mediatype == 'soundcloud')  results.media_types[2].value++
    if (share.mediatype == 'text')        results.media_types[3].value++
    if (share.mediatype == 'image')       results.media_types[4].value++
    
    // update values for user agent
    var browser = share.user_agent.family
    var newBrowser = true
    for(var i=0; i<results.user_agents.length; i++){
      if (results.user_agents[i].label == browser){
        newBrowser = false;
        results.user_agents[i].value++
      }
    }
    if (newBrowser){
      results.user_agents.push({ label: browser, value: 1 })
    }

    // create a new key of month-day-year
    var _d = share.date_obj
    var _k = _d.month+'-'+_d.day+'-'+_d.year;
    // if the key doesn't exist yet, create it
    if (typeof _tmp[_k] == 'undefined') {
      _tmp[_k] = 0;
    }
    // increment that key value
    _tmp[_k]++;

  })
  
  // form the data into the format D3 wants
  for(var key in _tmp){
    results.num_shares.values.push([ new Date(key), _tmp[key] ])
  }
  // sort the data by timestamp
  results.num_shares.values.sort(function compareTimestamp(a,b){
    return a[0] - b[0]
  })

  return results
}


Shhh.prototype._mediaTypeData = function(){
  return this.data.media_types;
}

Shhh.prototype._userAgentsData = function(){
  return this.data.user_agents;
}

Shhh.prototype._dropLinksData = function(){
  return this.data.drop_vs_links;
}

Shhh.prototype._numSharesData = function(){
  return [this.data.num_shares]; // needs to be an array
}


