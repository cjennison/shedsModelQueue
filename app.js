//Sheds Queue Module
var kue = require('kue');

var jobs = kue.createQueue();
console.log("Creating Queue")

//process the job
jobs.process('script', 1, function(job, done){
  console.log("Queue: Processing script");

  //Place script processing here
  done();
})

//queue events
jobs.on('job complete', function(id, result){
  console.log("Job " + id + " completed")
})

jobs.on('job failed', function(id, result){
  console.log("Job " + id + " failed")
})
