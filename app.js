//Sheds Queue Module
var kue = require('kue');

var jobs = kue.createQueue();
console.log("Creating Queue")

//Create basic UI
kue.app.listen(3000);
kue.app.set('title', 'My Application');

//Create a job
function queueScript(params, cb){
  if(params == null) 
    return {id:null}

  console.log("Queue: Creating job");

  var job = jobs.create('script', params)
  job.save(function(err){
    if(err)
        console.log(err)
    
    //return the new job with an ID for reference
    cb(job)
  });
}

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
