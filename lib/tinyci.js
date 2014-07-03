var config_file = process.argv[2]
var cwd = process.cwd()
var co = require('co')
var path = require('path')
var fs = require('fs-extra')
var exec = require('child_process').exec
var spawn = require('child_process').exec
config_file = path.resolve(cwd, config_file)
var config = require(config_file)
global.config = config

config.tmp = config.tmp || '/tmp/tinyci'

co(function*(){

    console.log('start')
    for(var name in config.projects) {
      var project = config.projects[name]
      project.name = name
      console.log('init', project.name)
      yield init(project)
      console.log('inited')
      yield build(project)
    }

})(function(err) {
    if(err) console.log(err.stack)
    console.log('done')
})

process.on('uncaughtException', function(err) {
    console.log('uncaughtException', err)
})

function init(project) {
  return function(callback) {
    project.path = project.path || (path.normalize(config.tmp + '/' + project.name))
    fs.mkdirpSync(project.path)
    if(!fs.existsSync(project.path + '/.git')) {
      exec('git clone ' + project.repo + ' ' + project.path, function(err, stdout, stderr) {
          console.log('111')
          console.log(stdout)
          console.log(stderr)
          callback(err)
      })
    } else {
      callback()
    }
  }
}

function update(project, branch) {

}

function* build(project) {
  for(name in project.tasks) {
    var task = project.tasks[name]
    yield runTask(project, task)
  }
}

function* runTask(project, task) {
    var child = spawn(task.cmd, {cwd: project.path})
    child.stdout.on('data', function(data) {
        process.stdout.write(data)
    })
    child.stderr.on('data', function(data) {
        process.stderr.write(data)
    })
    child.on('close', function(code) {
        if(code !== 0) {
          console.log('exit with ' + code)
        }
        console.log('success')
    })
}

