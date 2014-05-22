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
    type: '',
    mimetype: '',
    user_agent: '',
    ip: '',
    created: Date.now()
  }
  Object.merge(share, data)
  this.db.share.insert(share, cb)
}

module.exports = DB;