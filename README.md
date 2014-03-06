scanjs
======

- Static analysis tool for javascript codebases. Scanjs uses Acorn to convert sources to AST, then walks AST looking for patterns.
- Works on both client and server side

Client-side instructions
------------------------
- ```git clone https://github.com/mozilla/scanjs.git```
- Navigate to scanjs/client/index.html or see our [example page](http://mozilla.github.io/scanjs/client/)

Server-side instructions
------------------------

- Install [node.js](http://nodejs.org/)
- ```git clone https://github.com/mozilla/scanjs.git```
- ```cd scanjs```
- ```npm install```
- ```node index.js -t DIRECTORY_PATH```
