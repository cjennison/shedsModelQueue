var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pkg = require('../package.json');
var kue = require('kue');

var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

var env = process.env.NODE_ENV || 'development';

module.exports = function(app, config){
  app.set('showStackError', true);

  app.use(favicon());
  app.use(express.static(rootPath + '/public'));

  // cookieParser should be above session
  app.use(cookieParser());

  // bodyParser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());

  // set views path, template engine and default layout
  app.set('views', rootPath + '/views');
  app.set('view engine', 'ejs');

   // KUE routes
  app.use('/kue', kue.app);

  // Bootstrap routes
  require('./routes')(app);



   // catch 404 and forward to error handler
  app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
  });

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
          res.status(err.status || 500);
          res.render('error', {
              message: err.message,
              error: err
          });
      });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: {}
      });
  });

}