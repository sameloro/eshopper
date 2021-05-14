require('dotenv').config();
var express = require('express'),
  app = express(),
  port = process.env.SERVER_PORT || 3000,
  mongoose = require('mongoose'),
  Task = require('./api/models/todoListModel'), //created model loading here
  bodyParser = require('body-parser'),
  utils = require('./js/utils');

  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(utils.uri); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/todoListRoutes'); //importing route
routes(app); //register the route


app.listen(port);


console.log('todo list RESTful API server started on: ' + port);

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
  });