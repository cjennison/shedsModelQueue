//Sheds Queue Module
var kue = require('kue'),
    uuid = require('node-uuid'),
    fs = require('fs'),
    mkdirp = require("mkdirp")
    path = require('path'),
    spawn = require('child_process').spawn;

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
  var run = {};

  // console.log(job)
  var dir = uuid.v4();
  var local_directory = "runs/" + dir;
  mkdirp(local_directory, function(err){
    if(err) console.log(err)
    else {
      console.log(dir + ": created")

      //TODO: Store the directory in the RUN object

      //Write JSON file
      writeJSON(job.data, "runs/" + dir + "/", function(){
        runModel(job, local_directory);
      });
    }
  })

  //Place script processing here
  done();
})

//Spawns the R script to run the job
function runModel(job, dir, cb){
  var script = "test_1.R" //TODO: replace with actual script from databaser

  //Create the opts for spawn
  var opts = {
    cwd: __dirname + "/" + dir + "/",
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
  var proc = spawn("Rscript", args, opts);

  //Watch for data 
  proc.stdout.on('data', function(data){
    console.log("stdout: " + data);
  })

  proc.stderr.on('data', function(data){
    console.log("stderr: " + data);
  })

  //Check Exit Code
  proc.on('exit', function(code){
    if(code === 0){
      console.log("Success")
    } else {
      console.log("Failure")
    }
  })

}

//Write the JSON input field
function writeJSON(data, dir, cb){
  fs.writeFile(dir + "input.json", JSON.stringify(data.input, null), function(err){
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


