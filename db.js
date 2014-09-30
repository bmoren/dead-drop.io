//
// NOT DONE YET
//
require('sugar')
var mongo = require('mongoskin')

var DB = function(dbname){
  this.db = mongo.db("mongodb://localhost:27017/"+ dbname, {native_parser:true});
  this.db.bind('share')
}

DB.prototype.saveShare = function(data, cb){
  if (typeof data != 'object') return cb('error', null);
  var share = {
    url: '',
    type: '', // text, image, url
    mimetype: '',
    user_agent: '',
    ip: '',
    created: Date.now()
  }
  Object.merge(share, data)
  this.db.share.insert(share, cb)
}

DB.prototype.getShares = function(cb){
  this.db.share.find().toArray(cb)
}

DB.prototype.fakeData = function(){

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
