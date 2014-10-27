//
// NOT DONE YET
//
require('sugar')
var mongo = require('mongoskin')
var request = require('request')
var async = require('async')
var useragent = require('useragent')

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
  var created = new Date()
  var user_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var share = {
    url: '',
    type: '',       // image, url, text
    mediatype: '',  // image, text, vimeo, youtube, soundcloud
    mimetype: '',
    dropped: false, // if true the user drag/drop'd an item, if false they pasted a url
    user_agent: useragent.lookup(req.headers['user-agent']),
    ip: user_ip,
    created: created.getTime(),
    date_obj: {
      year: created.getFullYear(),
      month: created.getMonth()+1, // +1 for month offset, boo
      day: created.getDate()
    }
  }

  Object.merge(share, data);
  var lastUrl = share.url;
  delete share.url;

  async.waterfall([
    // add the new share
    function(next){
      self.db.share.insert(share, next)
    },
    // update the recover share data
    function(share, next){
      var doc = {
        lastUrl: lastUrl, 
        share_id: share[0]._id,
        updated: Date.now()
      }
      self.db.recover.update({_id: 'lastUrl'}, {$set: doc}, {upsert: true}, next)
    }
  ], function(err, results){
    if (err){
      console.log(err);
    }
  })
}


DB.prototype.getShares = function(time, cb){
  if (typeof time == 'function'){
    cb = time
    time = 0
  }
  time = Number(time)
  var date = new Date().reset('day')
  var params = {}

  if (time != 0){
    date.rewind({month: time})
    params.created = { $gte: +date }
  }

  this.db.share.find(params).toArray(cb)
}


DB.prototype.getStats = function(cb){
  // get most recent share
  var result = {
    shares: 0,
    recent: null
  }
  var self = this;
  // get count of all shares (all time)
  this.db.share.count({}, function(err, count){
    result.shares = count;
    // get initial share (should be same as most recent share)
    self.getInitialShare(function(err, recent){
      result.recent = recent;
      cb(err, result)
    })
  })
}


DB.prototype.getInitialShare = function(cb){
  var self = this;
  self.db.recover.find().toArray(function(err, doc){
    self.db.share.find({_id: doc[0].share_id}).toArray(function(err, share){
      if (!share[0]) share[0] = {}
      share[0].__url = doc[0].lastUrl
      cb(err, share[0])
    })
  })
}

var migrations = {}

migrations.date_obj = function(share){
  if (typeof share.date_obj != 'undefined') return share;
  var created = new Date(share.created)
  var data = {
    year: created.getFullYear(),
    month: created.getMonth()+1,
    day: created.getDate()
  }
  share.date_obj = data;
  return share;
}

migrations.update_ua = function(share){
  var ua = share.user_agent
  if (typeof ua == 'string'){
    share.user_agent = useragent.lookup( ua )
  }
  return share;
}

migrations.remove_data_obj = function(share){
  if (typeof share.data_obj == 'undefined') return false
  delete share.data_obj
  return {"data_obj": ""}
}


DB.prototype.migrations = function(cb){
  var self = this;
  var fns = []
  this.getShares(function(err, shares){
    var count = 0;
    console.log('processing', shares.length, 'document(s)')
    shares.forEach(function(share){
      fns.push(function(done){
        console.log('> processing share:', share._id )
        // 1. add new `date_obj` property
        share = migrations.date_obj(share)

        // 2. updated the user agent data
        share = migrations.update_ua(share)

        // 3. remove "data_obj" returns an unset object
        var unset = migrations.remove_data_obj(share)

        var id = share._id
        delete share._id

        var options = { "$set": share }
        if (unset) options['$unset'] = unset

        count++;

        self.db.share.update({_id: id}, options, done)
      })
    })
    async.parallel(fns, function(err, results){
      console.log('processed', count, 'documents of', shares.length)
      cb(err, results)
    })
  })
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