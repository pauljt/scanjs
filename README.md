scanjs
======

- Static analysis tool for javascript codebases. Scanjs uses Acorn to convert sources to AST, then walks AST looking for patterns.
- Works on both client and server side

Client-side instructions
------------------------
- ```git clone https://github.com/mozilla/scanjs.git```
- ```node server.js```
- Navigate to scanjs/client/ or see our [example page](http://mozilla.github.io/scanjs/client/)

Server-side instructions
------------------------
- Install [node.js](http://nodejs.org/)
- ```git clone https://github.com/mozilla/scanjs.git```
- ```cd scanjs```
- ```npm install```
- ```node scanner.js -t DIRECTORY_PATH```

Testing instructions
------------------------
We use the mocha testing framework.
```node server.js```
```http://127.0.0.1:4000/tests/```

To add tests, create a new file in ```/tests/cases/``` and following the naming
convention, which should be obvious. For example, our rule named .innerHTML
lives in ```/tests/cases/innerhtml.js```.

From there, add the new test case to ```/tests/index.html```. In our
example, that would involve adding a ```<script src='/tests/cases/innerhtml.js'></script>```.
