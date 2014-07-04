var co = require('co')
var path = require('path')
var commander = require('commander')
var runner = require('./runner')

commander.version('0.1.0')
  .usage('[options] <file>')
  .option('-o, --output [output]', 'Output data folder')
  .option('-p, --port [port]', 'Listen on a port')
  .option('--project [project]', 'Run tasks for a project')
  .parse(process.argv)

var config_file = commander.args[0]
if(!config_file) {
  commander.outputHelp()
  return
}
var cwd = process.cwd()
config_file = path.resolve(cwd, config_file)
var config = require(config_file)
global.config = config
config.tmp = config.tmp || '/tmp/tinyci'
config.output = commander.output || config.output

if(!config.output) {
  console.log('\nError: No output folder specified in config')
  return commander.outputHelp()
}

for(var name in config.projects) {
  var project = config.projects[name]
  project.name = name
}

if(commander.port) {
  require('./server').listen(commander.port)
}

process.on('uncaughtException', function(err) {
    console.log('uncaughtException', err.stack)
})

co(function*(){
    if(commander.project) {
      yield runner.initProject(commander.project)
      yield runner.updateProject(commander.project)
    } else {
      yield runner.initAllProjects()
      yield runner.updateAllProjects()
    }
})()

