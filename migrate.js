// 
// Run some db migration
// 
var db = require('./db')
var DB = new db('deaddrop')

console.time('migrations')

console.log('Running Database Migrations')
console.log('----------------------------')

DB.migrations(function(err, res){
  if (err) console.log( err )
  console.timeEnd('migrations')
  process.exit()
})