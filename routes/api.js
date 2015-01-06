var express = require('express'),
    router = express.Router(),
    queue  = require("../lib/queue")

router.route('/models')
  .get(send405) //TODO: add real response
  .post(function(req, res){
    //Make a new model run
    var job = queue.queueScript({
      title:"Model Script"
    }, function(job){
      res.json(job)
    });
  })


function send405(req, res) {
  res.send(405);
}

module.exports = router;