//
// NOT DONE YET
//
require('sugar')
var mongo = require('mongoskin')
var request = require('request')
var async = require('async')

var DB = function(dbname){
  this.db = mongo.db("mongodb://localhost:27017/"+ dbname, {native_parser:true});
  this.db.bind('share')
  this.db.bind('recover')
}


//
// Log some info whenever a user makes a share
// also, update the recovery.lastShare info
//
DB.prototype.saveShare = function(req, data){
  var self = this;
  var share = {
    url: '',
    type: '',       // image, url, text
    mediatype: '',  // image, text, vimeo, youtube, soundcloud
    mimetype: '',
    dropped: false, // if true the user drag/drop'd an item, if false they pasted a url
    user_agent: req.headers['user-agent'],
    ip: req.connection.remoteAddress || 0,
    created: Date.now()
  }

  Object.merge(share, data);
  var lastUrl = share.url;
  delete share.url;

  async.parallel([
    // add the new share
    function(done){
      self.db.share.insert(share, done)
    },
    // update the recover share data
    function(done){
      var doc = {
        lastUrl: lastUrl, 
        updated: Date.now()
      }
      self.db.recover.update({_id: 'lastUrl'}, {$set: doc}, {upsert: true}, done)
    }
  ], function(err, results){
    if (err){
      console.log(err);
    }
  })
}


DB.prototype.getShares = function(cb){
  this.db.share.find().toArray(cb)
}


DB.prototype.fakeData = function(){
  return;
  var data = {
    url: '',
    type: '',
    mimetype: '',
    user_agent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:22.0) Gecko/20130328 Firefox/22.0',
    ip: '1.2.3.4',
    created: Date.now()
  }

  var types = ['image, url']
  var type = 'text'

  for(var i=0; i<300; i++){
    if (i % 100 == 0) type == types.pop()
    data.type = type
    data.created = Date.now()
    data.mimetype = 'fake/'+ type
    data.url = 'http://placekitten.com/g/200/'+ String(100+i)
    this.saveShare(data, function(){})
  }
}


module.exports = DB;