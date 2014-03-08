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
getJSON('browser', 'js/lib/tern/defs/browser.json');
getJSON('ecma5', 'js/lib/tern/defs/ecma5.json');
getJSON('jquery', 'js/lib/tern/defs/jquery.json');