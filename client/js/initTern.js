defs = {};
// XXX ugly ----v
function getJSON(nme, loc) {
    var x = new XMLHttpRequest();
    x.open("GET", loc, true);
    x.send()
    x.onload = function() {
        defs[nme] = JSON.parse(x.response);
    }
}
getJSON('browser', '/client/js/lib/tern/defs/browser.json');
getJSON('ecma5', '/client/js/lib/tern/defs/ecma5.json');
getJSON('jquery', '/client/js/lib/tern/defs/jquery.json');
