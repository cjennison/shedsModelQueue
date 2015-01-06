
module.exports = function(app, cb){
  app.use('/api/v1', require('../routes/api'));
  app.use('/*', require('../routes/index'));
}