# scanjs #

- Static analysis tool for javascript codebases. Scanjs uses the Esprima library to parse JavaScript sources to an AST, then walks this AST looking for patterns defined in a rules file (see common/rules.js).

There are three main parts:

scanner.js: run this with node against a directory containing .js files (includes sub-directories in search)
reportviewer.html: use this page to load the resulting .json report from scanner.js
ruletester.html: use this to test, edit rules, and generate new rule files to scan with.

## Requirements ##
The command line tool requires Node.js and the Esprima & Optimist packages. To get started:

## Quickstart ##
Assuming you have both node and git installed, the following will get you started:

$git clone https://github.com/pauljt/scanjs
$cd scanjs
$npm install
$node scanner.js -t target/js/files

This will generate result file called 'scanresults.json'. Open the reportviewer.html, and load this file to see the results.

## scanner.js ##
This is the main file, to be run with node against a directory containing HTML files.

### Usage ###
Usage: $node scanner.js -t [path/to/target] [options]

Options:
  -t, --target  [required]
  -n, --name    [default: "scanresults"]
  -r, --rules   [default: "common/rules.js"]

By default, scanner.js writes a report in JSON format to 'scanresults.json'. It also copies all files scanned to a subdirectory, so they can be linked in the reportviewer

## reportviewer.html ##
Open reportviewer.html in a browser. Load a results json previously generated with scanner.js

## ruletester.html ##
Open ruletester.html in a browser. Use the 'rules' tab to modify the rules. Changes are stored using local storage - to use these rules in scanner.js, manually take a copy of /common/rules.js and edit it directly. 