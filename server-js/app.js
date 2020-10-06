const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer  = require("multer");

const app = express();

const corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204,
  "maxAge": 3600,
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {//next()
    cb(null, 'server-js/download')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.png')//??????????
  }
});





app.use(multer({ storage: storage }).single("file"));
app.use(cors(corsOptions)); 

app.use(express.static('public/full'));
app.use(express.static('server-js/download'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


const authorization = require('./routes/auth');
const user = require('./routes/user');
const feed = require('./routes/feed');
const adminRights = require('./routes/admin-rights');
const coment = require('./routes/coment');

app.use('/auth', authorization);
app.use('/user', user);
app.use('/feed', feed);
app.use('/coment', coment);
app.use('', adminRights);

//Using pug template 
app.set('views', './src/pug')
app.set('view engine', 'pug')
app.get('/', function (req, res) {
  startTime = new Date();
  res.render('index', { startTime: startTime.toLocaleTimeString()});
});


module.exports = app;
