// 
// Run some db migration
// 
var db = require('./db')
var DB = new db('deaddrop')

console.time('migrations')

DB.migrations(function(err, res){
  console.log('Running Database Migrations')
  console.log('----------------------------')
  console.log( err )
  console.timeEnd('migrations')
  process.exit()
})