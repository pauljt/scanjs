(function() {
var rules = [
	{
		"type": "execution_sink",
		"name": "eval",
		"test": "eval()",
		"desc": "Controlling of the first argument to eval(...) results in direct script execution.",
		"rec": "Avoid use of eval. If you have to use it, be VERY sure about what you are eval-ing."
	},
	{
		"type": "execution_sink",
		"name": "setTimeout",
		"test": "setTimeout()",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "execution_sink",
		"name": "setInterval",
		"test": "setInterval()",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "execution_sink",
		"name": "new Function(",
		"test": "function test(node) {return node.type == \"NewExpression\" && node.callee.name == \"Function\";}",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "execution_sink",
		"name": "crypto.generateCRMFRequest",
		"test": "function test(node) {return node.type==\"CallExpression\" && (node.callee.property && node.callee.property.name==\"generateCRMFRequest\");}",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "HTMLElement_sink",
		"name": "document.write",
		"test": "document.write()",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "HTMLElement_sink",
		"name": "document.writeln",
		"test": "document.writeln()",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "HTMLElement_sink",
		"name": ".innerHTML",
		"test": "function test(node) {\n  if (node.type == \"AssignmentExpression\" && node.left.property && (node.left.property.name == \"innerHTML\" || node.left.property.value == \"innerHTML\")) {\n    var hasIdentifier = false;\n    ScanJS.traverse(node.right, function(node) {\n      if (node.type == \"Identifier\") {\n        hasIdentifier = true;\n      }\n    });\n\n    if (hasIdentifier == true) {\n      return true;\n    }\n  }\n  return false;\n}",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "HTMLElement_sink",
		"name": ".outerHTML",
		"test": "function test(node) {\n  if (node.type == \"AssignmentExpression\" && node.left.property && (node.left.property.name == \"outerHTML\" || node.left.property.value == \"outerHTML\")) {\n    var hasIdentifier = false;\n    ScanJS.traverse(node.right, function(node) {\n      if (node.type == \"Identifier\") {\n        hasIdentifier = true;\n      }\n    });\n\n    if (hasIdentifier == true) {\n      return true;\n    }\n  }\n  return false;\n}",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "HTMLElement_sink",
		"name": ".createContextualFragment",
		"test": "createContextualFragment()",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "HTMLElement_sink",
		"name": ".parseFromString",
		"test": "parseFromString()",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "url_sink",
		"name": "\\.src",
		"test": ".src",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "url_sink",
		"name": "\\.data",
		"test": ".data",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "url_sink",
		"name": "\\.href",
		"test": ".href",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "url_sink",
		"name": "\\.action",
		"test": ".action",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "intereting_function",
		"name": "escapeHTML",
		"test": "escapeHTML",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "intereting_function",
		"name": "window.open",
		"test": "window.open()",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "intereting_function",
		"name": "mozSetMessageHandler",
		"test": "mozSetMessageHandler",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "intereting_function",
		"name": "MozActivity",
		"test": "MozActivity",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": ".mozAlarms",
		"test": ".mozAlarms",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "mozaudiochannel",
		"test": "mozaudiochannel",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": ".mozBluetooth",
		"test": ".mozBluetooth",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": ".mozCameras",
		"test": ".mozCameras",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": ".mozCellBroadcast",
		"test": ".mozCellBroadcast",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": ".mozContacts",
		"test": ".mozContacts",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": ".mozNotification",
		"test": ".mozNotification",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": ".getDeviceStorage",
		"test": ".getDeviceStorage",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "mozapp",
		"test": "mozapp",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "mozFMRadio",
		"test": "mozFMRadio",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "geolocation",
		"test": "geolocation",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "addIdleObserver",
		"test": "addIdleObserver",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "mozMobileConnection",
		"test": "mozMobileConnection",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "moznetworkupload",
		"test": "moznetworkupload",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "moznetworkdownload",
		"test": "moznetworkdownload",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "ote",
		"test": "ote",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "mozPermissionSettings",
		"test": "mozPermissionSettings",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "mozPower",
		"test": "mozPower",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "mozSettings",
		"test": "mozSettings",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "mozSms",
		"test": "mozSms",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "mozSystem",
		"test": "mozSystem",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "mozTCPSocket",
		"test": "mozTCPSocket",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "mozTelephony",
		"test": "mozTelephony",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "mozTime",
		"test": "mozTime",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "mozVoicemail",
		"test": "mozVoicemail",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "mozApps.mgmt",
		"test": "mozApps.mgmt",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "mozWifiManager",
		"test": "mozWifiManager",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "privileged_function",
		"name": "mozKeyboard",
		"test": "mozKeyboard",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "client_side_torage",
		"name": "localStorage",
		"test": "localStorage",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "client_side_torage",
		"name": "indexedDB",
		"test": "indexedDB",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "client_side_torage",
		"name": "indexeddb",
		"test": "indexeddb",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "client_side_torage",
		"name": "mozSetMessageHandler",
		"test": "mozSetMessageHandler",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "event",
		"name": "addEventListener",
		"test": "addEventListener",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "event",
		"name": "mozChromeEvent",
		"test": "mozChromeEvent",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "event",
		"name": "CustomEvent",
		"test": "CustomEvent",
		"desc": "todo",
		"rec": "todo"
	},
	{
		"type": "event",
		"name": "message",
		"test": "message",
		"desc": "todo",
		"rec": "todo"
	}
];

if (typeof module != 'undefined') {
	module.exports = rules;
} else {
	ScanJS.rules = rules;
}
})();