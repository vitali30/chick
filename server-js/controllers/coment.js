const coll = require('../database');
const ObjectId = require('mongodb').ObjectID;

module.exports.addOneComent = function(request, response) {
  const gettingObject = JSON.parse(request.body.json);
  coll.coment.insertOne(gettingObject, (error) => {
    if(error) { console.error(error) }
    else{ response.json('post added') }
  })
}

module.exports.getAllComents = function(require, response) {
  coll.coment.find().toArray(function(err, results){
    if (err) {response.json(err)}
    else{
      console.log(results)
      response.json(JSON.stringify(results))}     
  });
}








