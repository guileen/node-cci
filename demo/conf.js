module.exports = {
  projects : {
    allserver: {
      repo: 'git@github.com:guileen/node-tinyci.git',
      path: __dirname + '/myrepo',
      tasks: [
        {
          cmd: 'npm install'
        },
        {
          cmd: 'mocha --harmony'
        }
      ]
    }
  }
}
