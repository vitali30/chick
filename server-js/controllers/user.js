const coll = require('../database')
const ObjectId = require('mongodb').ObjectID;

module.exports.saveFile = function (request, response) {
  response.send({result: request.file.filename});
}

module.exports.deleteUser = function(request, response) {
  const entering = request.params.login;
  coll.collection.deleteOne({ login: entering })
  .then(function(){ 
    response.json('user deleted')
  })
  .catch(function(error){ 
    response.json(error);
  })
}

module.exports.updateUser = function(request, response) {
  const entering = request.params.login;
  const gettingObject = JSON.parse(request.body.json);
  coll.collection.replaceOne({ login: entering }, gettingObject, null, function (err, docs) { 
    if (err){ response.json(err) } 
    else{ response.json('User updated');  } 
  }); 
}

module.exports.changeUserName = function(request, response) {
  const gettingObject = JSON.parse(request.body.json);
  coll.collection.updateOne({login: gettingObject.login}, {
      $set: { firstName: gettingObject.firstName, lastName: gettingObject.lastName }}, function (err, docs) { 
        if (err){ response.json(err) } 
        else{ response.json("User name updated sucesfully") } 
    }
  )
}

module.exports.changeUserStatus = function(request, response) {
  const gettingObject = JSON.parse(request.body.json);
  coll.collection.updateOne({login: gettingObject.login}, {
    $set: { status: gettingObject.status }}, function (err, docs) { 
      if (err){ response.json(err) } 
      else{ response.json("User status updated sucesfully") } 
    }
  )
}

module.exports.getAll = function(request, response) {
  coll.collection.find().toArray(function(err, results){
    if (err) {response.json(err)}
    else{response.json(JSON.stringify(results))}     
  });
}

module.exports.getOneUser = function(request, response) {
    const entering = request.params.login;
    coll.collection.find({login: entering}).toArray(function(err, result) {
      if(err) {response.json(err)}
      else{response.json(JSON.stringify(result))}
    })
  }

  module.exports.getOneUserID = function(request, response) {
    const entering = request.params.id;
    coll.collection.find({_id: ObjectId(entering)}).toArray(function(err, result) {
      if(err) {response.json(err)}
      else{ response.json(JSON.stringify(result))}
    })
  }

