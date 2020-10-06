const url = "mongodb://localhost:27017/";

const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient(url, { useNewUrlParser: true });

mongoClient.connect(function(err, client){
  if(err){ return console.log(err) }
  const db = client.db("chick");
  const collection = db.collection("users");
  const feed = db.collection("feeds");
  const coment = db.collection("coments");
  
  module.exports.collection = collection;
  module.exports.feed = feed;
  module.exports.coment = coment
});    