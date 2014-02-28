(function() {
var rules = [
    {
        "type": "execution_sink",
        "name": "eval",
        "test": "eval()",
        "desc": "Controlling of the first argument to eval(...) results in direct script execution.",
        "rec": "Avoid use of eval. If you have to use it, be VERY sure about what you are eval-ing. eval() will not work in Firefox OS and other contexts, which are protected by Content Security Policy (CSP)"
    },
    {
        "type": "execution_sink",
        "name": "setTimeout",
        "test": "setTimeout()",
        "desc": "Controlling of the first argument to setTimeout(...) results in direct script execution.",
        "rec": "Avoid passing user input to setTimeout. The first parameter can also be a function, which is much safer than a string. A string paramter will not work in Firefox OS and other contexts, which are protected by Content Security Policy (CSP)."
    },
    {
        "type": "execution_sink",
        "name": "setInterval",
        "test": "setInterval()",
        "desc": "Controlling of the first argument to setTimeout(...) results in direct script execution.",
        "rec": "Avoid passing user input to setInterval. The first parameter can also be a function, which is much safer than a string. A string paramter will not work in Firefox OS and other contexts, which are protected by Content Security Policy (CSP)."
    },
    {
        "type": "execution_sink",
        "name": "new Function(",
        "test": "function test(node) {return node.type == \"NewExpression\" && node.callee.name == \"Function\";}",
        "desc": "Controlling of the first argument to Function(...) can result in direct script execution.",
        "rec": "Avoid using the Function constructor. In most cases writing down the function in itself can work as well. The Function constructor will not work in Firefox OS and other contexts, which are protected by Content Security Policy (CSP)."
    },
    {
        "type": "execution_sink",
        "name": "crypto.generateCRMFRequest",
        "test": "function test(node) {return node.type==\"CallExpression\" && (node.callee.property && node.callee.property.name==\"generateCRMFRequest\");}",
        "desc": "The fifth parameter towards this function may be used as a callback. If this parameter is a string, it will be handled like eval.",
        "rec": "Avoid passing user input to generateCRMFRequest."
    },
    {
        "type": "HTMLElement_sink",
        "name": "document.write",
        "test": "document.write()",
        "desc": "Writing to the document mixes HTML, CSS and Text content, can cause computationally expensive page reflows and might lead to XSS.",
        "rec": "Avoid the use of document.write. There are specific DOM methods like document.createElement and <node>.appendChild for example.."
    },
    {
        "type": "HTMLElement_sink",
        "name": "document.writeln",
        "test": "document.writeln()",
        "desc": "Writing to the document mixes HTML, CSS and Text content, can cause computationally expensive page reflows and might lead to XSS.",
        "rec": "Avoid the use of document.writeln. There are specific DOM methods like \ndocument.createElement and <node>.appendChild for example."
    },
    {
        "type": "HTMLElement_sink",
        "name": ".innerHTML",
        "test": "function test(node) {\n  if (node.type == \"AssignmentExpression\" && node.left.property && (node.left.property.name == \"innerHTML\" || node.left.property.value == \"innerHTML\")) {\n    var hasIdentifier = false;\n    ScanJS.traverse(node.right, function(node) {\n      if (node.type == \"Identifier\") {\n        hasIdentifier = true;\n      }\n    });\n\n    if (hasIdentifier == true) {\n      return true;\n    }\n  }\n  return false;\n}",
        "desc": "Assignments to innerHTML with user input can lead to XSS.",
        "rec": "Avoid innerHTML completely and use specific DOM methods like document.createElement and <node>.appendChild"
    },
    {
        "type": "HTMLElement_sink",
        "name": ".outerHTML",
        "test": "function test(node) {\n  if (node.type == \"AssignmentExpression\" && node.left.property && (node.left.property.name == \"outerHTML\" || node.left.property.value == \"outerHTML\")) {\n    var hasIdentifier = false;\n    ScanJS.traverse(node.right, function(node) {\n      if (node.type == \"Identifier\") {\n        hasIdentifier = true;\n      }\n    });\n\n    if (hasIdentifier == true) {\n      return true;\n    }\n  }\n  return false;\n}",
        "desc": "Assignments to outerHTML with user input can lead to XSS.",
        "rec": "Avoid outerHTML completely and use specific DOM methods like document.createElement and <node>.appendChild"
    },
    {
        "type": "HTMLElement_sink",
        "name": ".createContextualFragment",
        "test": "createContextualFragment()",
        "desc": "This function creates DOM Fragments from strings and might lead to XSS",
        "rec": "Be careful not to insert DOM Fragments created from user input into your document."
    },
    {
        "type": "HTMLElement_sink",
        "name": ".parseFromString",
        "test": "parseFromString()",
        "desc": "This method allows creating a HTML DOM from strings. This is potentially harmful and might lead to XSS.",
        "rec": "Do not insert elements of a DOM that is created from user input into your document."
    },
    {
        "type": "url_sink",
        "name": "\\.src",
        "test": ".src",
        "desc": "Changing the source of certain attributes might lead to XSS, depending on the element and user interactions afterwards.",
        "rec": "Be careful not to allow user input for the src attribute of script elements. JavaScript and Data URIs pose additional risk as they might lead to script execution for other tags."
    },
    {
        "type": "url_sink",
        "name": "\\.data",
        "test": ".data",
        "desc": "Reading data from untrusted source might lead to XSS.",
        "rec": "Make sure to validate and sanitize untrusted third-party and cross-origin data."
    },
    {
        "type": "url_sink",
        "name": "\\.href",
        "test": ".href",
        "desc": "URLs pointing to the javascript: and data: protocols can lead to XSS.",
        "rec": "Sanitize URLs to make sure they point to something that is allowed, if you have to deal with user input."
    },
    {
        "type": "url_sink",
        "name": "\\.action",
        "test": ".action",
        "desc": "Setting the action attribute on forms can lead to exfiltration of private data",
        "rec": "Do not allow user input to specify this attribute."
    },
    {
        "type": "interesting_function",
        "name": "escapeHTML",
        "test": "escapeHTML",
        "desc": "Implementing your own HTML escaper is a risky and tedious task. Remember that you have to escape for the context a string is being used in, there is no generic solution that works in all scenarios.",
        "rec": "Read up on some best practices and remember that certain attributes and tags may perform automated entity decoding which can leave dangerous characters undetected."
    },
    {
        "type": "interesting_function",
        "name": "window.open",
        "test": "window.open()",
        "desc": "URLs pointing to javascript: and data: protocols can lead to XSS. Popups can also confuse and misdirect users",
        "rec": "Do not allow user input in window.open(). If windows have to communicate with each other use postMessage and always check for the correct origin."
    },
    {
        "type": "interesting_function",
        "name": "mozSetMessageHandler",
        "test": "mozSetMessageHandler",
        "desc": "This function allows registering message handlers for Web Activities.",
        "rec": "Remember that untrusted apps might invoke these activities with untrusted data and sanitize accordingly."
    },
    {
        "type": "interesting_function",
        "name": "MozActivity",
        "test": "MozActivity",
        "desc": "This function creates new Web Activities and can transfer data from one app to another",
        "rec": "Make sure that you do not expose private or confidential data within those activities, as any malicious app might entice the user into being opened as receiver."
    },
    {
        "type": "privileged_function",
        "name": ".mozAlarms",
        "test": ".mozAlarms",
        "desc": "This function is only available to higher privileged Firefox OS applications and allows setting and editing alarms. Frequent alarms might prevent power saving and drain the battery.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "mozaudiochannel",
        "test": "mozaudiochannel",
        "desc": "This function is only available to higher privileged Firefox OS applications.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": ".mozBluetooth",
        "test": ".mozBluetooth",
        "desc": "This function is only available to higher privileged Firefox OS applications.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": ".mozCameras",
        "test": ".mozCameras",
        "desc": "This function is only available to higher privileged Firefox OS applications.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": ".mozCellBroadcast",
        "test": ".mozCellBroadcast",
        "desc": "This function is only available to higher privileged Firefox OS applications.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": ".mozContacts",
        "test": ".mozContacts",
        "desc": "This function is only available to higher privileged Firefox OS applications.",
        "rec": "Contact data is sensitive data and should be handled with care."
    },
    {
        "type": "privileged_function",
        "name": ".mozNotification",
        "test": ".mozNotification",
        "desc": "This function is only available to higher privileged Firefox OS applications.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": ".getDeviceStorage",
        "test": ".getDeviceStorage",
        "desc": "This function is only available to higher privileged Firefox OS applications.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "mozapp",
        "test": "mozapp",
        "desc": "This function is only available to higher privileged Firefox OS applications.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "mozFMRadio",
        "test": "mozFMRadio",
        "desc": "This function is only available to higher privileged Firefox OS applications.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "geolocation",
        "test": "geolocation",
        "desc": "This function gives access to information about the user's location.",
        "rec": "Location is a very sensitive and private piece of data. Share and hand-off with absolute caution."
    },
    {
        "type": "privileged_function",
        "name": "addIdleObserver",
        "test": "addIdleObserver",
        "desc": "This function is only available to higher privileged Firefox OS applications.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "mozMobileConnection",
        "test": "mozMobileConnection",
        "desc": "This function is only available to higher privileged Firefox OS applications.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "moznetworkupload",
        "test": "moznetworkupload",
        "desc": "This function is only available to higher privileged Firefox OS applications.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "moznetworkdownload",
        "test": "moznetworkdownload",
        "desc": "This function is only available to higher privileged Firefox OS applications.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "ote",
        "test": "ote",
        "desc": "This function is only available to higher privileged Firefox OS applications.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "mozPermissionSettings",
        "test": "mozPermissionSettings",
        "desc": "This function is only available to higher privileged Firefox OS applications. It allows managing and revoking apps permissions.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "mozPower",
        "test": "mozPower",
        "desc": "This function is only available to higher privileged Firefox OS applications. It allows access to power management features.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "mozSettings",
        "test": "mozSettings",
        "desc": "This function is only available to higher privileged Firefox OS applications. It allows access to the phone's settings.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "mozSms",
        "test": "mozSms",
        "desc": "This function is only available to higher privileged Firefox OS applications. It allows access to SMS.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "mozSystem",
        "test": "mozSystem",
        "desc": "This function is only available to higher privileged Firefox OS applications.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "mozTCPSocket",
        "test": "mozTCPSocket",
        "desc": "This function is only available to higher privileged Firefox OS applications. It allows opening arbitrary TCP sockets.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "mozTelephony",
        "test": "mozTelephony",
        "desc": "This function is only available to higher privileged Firefox OS applications. It allows controlling the phone's telephony features.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "mozTime",
        "test": "mozTime",
        "desc": "This function is only available to higher privileged Firefox OS applications.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "mozVoicemail",
        "test": "mozVoicemail",
        "desc": "This function is only available to higher privileged Firefox OS applications. It allows controlling the phone's Voicemail features.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "mozApps.mgmt",
        "test": "mozApps.mgmt",
        "desc": "This function is only available to higher privileged Firefox OS applications. It allows managing the phone's app.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "mozWifiManager",
        "test": "mozWifiManager",
        "desc": "This function is only available to higher privileged Firefox OS applications. It allows managing the Wifi features of the phone.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "privileged_function",
        "name": "mozKeyboard",
        "test": "mozKeyboard",
        "desc": "This function is only available to higher privileged Firefox OS applications. It allows modifying and controlling the keyboard.",
        "rec": "Be careful when using this API in combination with untrusted user data"
    },
    {
        "type": "client_side_torage",
        "name": "localStorage",
        "test": "localStorage",
        "desc": "This API allows storing and retrieving data. Stored data might originally stem from untrusted user input.",
        "rec": "Treat database entries as untrusted and potentially hazardous as user data."
    },
    {
        "type": "client_side_torage",
        "name": "sessionStorage",
        "test": "sessionStorage",
        "desc": "This API allows storing and retrieving data. Stored data might originally stem from untrusted user input.",
        "rec": "Treat database entries as untrusted and potentially hazardous as user data."
    },

    {
        "type": "client_side_torage",
        "name": "indexedDB",
        "test": "indexedDB",
        "desc": "This API allows storing and retrieving data. Stored data might originally stem from untrusted user input.",
        "rec": "Treat database entries as untrusted and potentially hazardous as user data."
    },
    {
        "type": "client_side_torage",
        "name": "indexeddb",
        "test": "indexeddb",
        "desc": "This API allows storing and retrieving data. Stored data might originally stem from untrusted user input.",
        "rec": "Treat database entries as untrusted and potentially hazardous as user data."
    },
    {
        "type": "client_side_torage",
        "name": "mozSetMessageHandler",
        "test": "mozSetMessageHandler",
        "desc": "mozSetMessageHandler allows handling WebActivities. The origin of the activity and its data might be untrusted",
        "rec": "Make sure the origin of this activity is as expected. All data within this activity should be sanitized and handled with great care."
    },
    {
        "type": "event",
        "name": "addEventListener",
        "test": "addEventListener",
        "desc": "Events can be caused by untrusted source or even come from other origins.",
        "rec": "Validate the event source and the data for all incoming events."
    },
    {
        "type": "event",
        "name": "mozChromeEvent",
        "test": "mozChromeEvent",
        "desc": "mozChromeEvents are mostly used for window and activity handling.",
        "rec": "mozChromeEvents should be handled with care, as every interaction between chrome and content scripts."
    },
    {
        "type": "event",
        "name": "CustomEvent",
        "test": "CustomEvent",
        "desc": "CustomEvents can be dispatched and created arbitrarily",
        "rec": "Make sure that intended origin and data are valid and sane to be used in the current context."
    },
    {
        "type": "event",
        "name": "message",
        "test": "message",
        "desc": "Incoming messages can originate from foreign domains or apps and their data might be untrusted.",
        "rec": "Validate that the origin is matching the expected message source. In any case, incoming data should be treated with care."
    }
];

if (typeof module != 'undefined') {
	module.exports = rules;
} else {
	ScanJS.rules = rules;
}
})();