var parseUrl = require('url').parse
var http = require('http')
var runner = require('./runner')
var finalhandler = require('finalhandler')
var serveStatic = require('serve-static')

var outputServe = serveStatic(config.output, {index: ['index.html', 'index.htm']})
var defaultServe = serveStatic(__dirname + '/../public', {index: ['index.html', 'index.htm']})


module.exports = http.createServer(function(req, res) {
    var urlinfo = parseUrl(req.url)
    var match = /^\/gitlab\/hook\/(.+)$/.exec(urlinfo.path)
    if(match && match[1]) {
      var project = match[1]
      runner.updateProject(project)
      res.end()
    } else {
      // res.writeHead(404)
      // res.end()
      var done = finalhandler(req, res)
      outputServe(req, res, function() {
        defaultServe(req, res, done)
      })
    }
})
