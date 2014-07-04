var co = require('co')
var exec = require('child_process').exec
var fs = require('fs-extra')
var path = require('path')
var spawn = require('child_process').exec

function init(project) {
  return function(callback) {
    project.path = project.path || (path.normalize(config.tmp + '/' + project.name))
    fs.mkdirpSync(project.path)
    if(!fs.existsSync(project.path + '/.git')) {
      exec('git clone ' + project.repo + ' ' + project.path, function(err, stdout, stderr) {
          console.log(stdout)
          console.log(stderr)
          callback(err)
      })
    } else {
      callback()
    }
  }
}

function runCommand(cmd, path, stream) {
  return function(callback) {
    var child = spawn(cmd, {cwd: path})
    child.stdout.pipe(stream)
    child.stderr.pipe(stream)
    child.on('close', function(code) {
        callback(null, code);
    })
  }
}

function* update(project, branch) {
  var code = yield pull(project, branch)
  if(code !== 0) return code
  return yield build(project)
}

function* pull(project, branch) {
  return yield runCommand('git pull', project.path, process.stdout)
}

function* build(project) {
  for(name in project.tasks) {
    var task = project.tasks[name]
    yield runTask(project, task)
  }
}

function* runTask(project, task) {
  var code = yield runCommand(task.cmd, project.path, process.stdout)
}

exports.initAllProjects = function*() {
  for(var name in config.projects) {
    var project = config.projects[name]
    yield init(project)
  }
}

exports.updateAllProjects = function*() {
  for(var name in config.projects) {
    var project = config.projects[name]
    yield update(project)
  }
}

exports.initProject = function*(name) {
  yield init(config.projects[name])
}

exports.updateProject = function*(name) {
  yield update(config.projects[name])
}
