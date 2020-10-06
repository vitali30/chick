const coll = require('../database');
const ObjectId = require('mongodb').ObjectID;

module.exports.addUserToData = function (request, response) {
  const gettingObject = JSON.parse(request.body.json);
  coll.collection.insertOne(gettingObject)
  .then(result =>  response.json(result.insertedId))
  .catch(error => response.json(error))
}

module.exports.userAuth = function (request, response) {
  const enterUserId = request.params.id;
  coll.collection.updateOne({_id: ObjectId(enterUserId)}, {
    $set: { isAuth: true }}, function (err, docs) { 
      if (err){ response.json(err) } 
      else{ response.json("User auth set true sucesfully") } 
    }
  )
}

module.exports.userEsc = function (request, response) {
  coll.collection.updateOne({isAuth: true}, {
    $set: { isAuth: false }}, function (err, docs) { 
      if (err){ response.json(err) } 
      else{ response.json("User auth set true sucesfully") } 
    }
  )
}

module.exports.getCurrAuth = function (request, response) {
    coll.collection.find({isAuth: true}).toArray(function(err, result) {
      if(err) {response.json(err)}
      else{
        response.json(JSON.stringify(result))}
    })
}