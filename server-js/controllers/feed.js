const coll = require('../database');
const ObjectId = require('mongodb').ObjectID;

module.exports.addOnePost = function(request, response) {
  const gettingObject = JSON.parse(request.body.json);
  coll.feed.insertOne(gettingObject, (error) => {
    if(error) { console.error(error) }
    else{ response.json('post added') }
  })
}

module.exports.getAllFeedPosts = function(request, response) {
  coll.feed.find().toArray(function(err, results){
    if (err) {response.json(err)}
    else{response.json(JSON.stringify(results))}     
  });
}

module.exports.deletePostById = function(request, response) {
  const entering = request.params.id;
  coll.feed.deleteOne({ _id: ObjectId(entering) })
  .then(function(){ 
    response.json('user deleted')
  })
  .catch(function(error){ 
    response.json(error);
  })
}

module.exports.updateName = function(request, response) {
  const entering = request.params.id;
  const newName = JSON.parse(request.body.json);
  coll.feed.updateOne({_id: ObjectId(entering)}, {
    $set: {name: newName}}, function(err, docs) {
      if (err){ response.json(err) } 
      else{ response.json("feed post name update sucesfully") } 
    })
}

module.exports.updateBody = function(request, response) {
  const entering = request.params.id;
  const newBody = JSON.parse(request.body.json);
  coll.feed.updateOne({_id: ObjectId(entering)}, {
    $set: {text: newBody}}, function(err, docs) {
      if (err){ response.json(err) } 
      else{ response.json("feed post name update sucesfully") } 
    })
}