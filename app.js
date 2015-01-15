//Sheds Queue Module
var kue = require('kue'),
    uuid = require('node-uuid'),
    fs = require('fs'),
    mkdirp = require("mkdirp"),
    path = require('path'),
    spawn = require('child_process').spawn;

var jobs = kue.createQueue();
console.log("Creating Queue")

//process the job
jobs.process('script', 1, function(job, done){

  //Parse Job Data
  if(typeof(job.data) == "string")
    job.data = JSON.parse(job.data);

  //Check if the job is valid to be run
  if(!validateJob(job.data)) return done(new Error('invalid job'));

  runModel(job, job.data.wd, done);
  
})

//Spawns the R script to run the job
function runModel(job, dir, cb){
  
  var script = job.data.model_script;

  //Create the opts for spawn
  var opts = {
    cwd: dir,
    env: process.env
  }

  //Add rArgs to pass through spawn into R
  var rargs = JSON.stringify({
    wd: opts.cwd,
    input: 'input.json',
    output: 'output.json'
  });

  //Add script and Rargs to arg
  var args = [ __dirname + "/models/" + script, rargs ];

  //Spawn the session
  job.progress(0); // -- set progress
  console.log(job)
  var proc = spawn("Rscript", [__dirname + "/models/" + script, dir, 'input.json', 'output.json'], opts);

  //Watch for data 
  proc.stdout.on('data', function(data){
    //console.log("stdout: " + data);
  })

  proc.stderr.on('data', function(data){
    //console.log("stderr: " + data);
  })

  //Check Exit Code
  proc.on('exit', function(code){
    if(code === 0){
      console.log("Success")
    } else {
      console.log("Failure")
    }
    cb();
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
  console.log(result);
})

jobs.on('job failed', function(id, result){
  console.log("Job " + id + " failed")
})


