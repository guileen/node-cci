node-tinyci
===========

A very simple CI server

Feature
===========

* configure with js
* output CI results into static json
* no database required
* gitlab webhook
* daily build


Usage
========

## Start server

tinyci --port 10234 <config.js>

## Run once

tinyci <config.js> --project name

## gitlab webhook

http://host:10234/gitlab/hook/{project}

The project is the project name in your config file, NOT gitlab project name.


Configure
=========

```
module.exports = {
  projects : {
    "{projectName}": {
      repo: '{gitRepoUrl}',
      path: '{clone to path}', // default /tmp/tinyci/{projectname}
      tasks: [
        '<cmd>',
        '<cmd>',
        ...
      ]
    }
    ...
  }
}
```

use `{{dist}}` in `<cmd>` to copy dist files into that folder

Output
=========


```
/output
 |- <project ... >
 `- <project>
     |- versions.json
     `- <version>
         |- results.json
         `- dists
             |- file1.jar
             `- xxx.apk
```
