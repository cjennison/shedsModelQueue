//Sheds Queue Module
var kue = require('kue'),
    uuid = require('node-uuid'),
    fs = require('fs'),
    mkdirp = require("mkdirp");

var getDirName = require("path").dirname

var jobs = kue.createQueue();
console.log("Creating Queue")

//process the job
jobs.process('script', 1, function(job, done){
  console.log("Queue: Processing script");


  //Parse Job Data
  job.data = JSON.parse(job.data);

  //Check if the job is valid to be run
  if(!validateJob(job.data)) return done(new Error('invalid job'));

  //TODO: Create RUN Object from Database model

  // console.log(job)
  var dir = uuid.v4();
  mkdirp("runs/" + dir, function(err){
    if(err) console.log(err)
    else {
      console.log(dir + ": created")

      //TODO: Store the directory in the RUN object

      //Write JSON file
      writeJSON(job.data, "runs/" + dir + "/", runModel);
    }
  })

  //Place script processing here
  done();
})

//Spawns the R script to run the job
function runModel(job, cb){
  console.log("Running Job")
}

function writeJSON(data, dir, cb){
  fs.writeFile(dir + "inputs.json", JSON.stringify(data.input, null), function(err){
    if(err) console.log(err)
    else {
      cb();
    }
  })
}

//Make sure a job is valid
function validateJob(data){
  if(data.user_id === null) return false
  if(data.model_id === null) return false
  
  return true
}

//queue events
jobs.on('job complete', function(id, result){
  console.log("Job " + id + " completed")
})

jobs.on('job failed', function(id, result){
  console.log("Job " + id + " failed")
})
