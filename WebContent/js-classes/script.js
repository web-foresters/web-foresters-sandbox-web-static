function run() {
	try {
		var code = getCode();
		eval(code);
	} catch (err) {
		logToConsole('Error running the script: look in the DevTools console for more details.');
		console.error('Error running the script', err.toString(), err);
	}
}

function getCode() {
	return document.getElementById('Code').value;
}


/*
	CONSOLE: BEGIN
*/

function logToConsole() {
	logToConsoleElement(arguments);
	console.log(arguments);
}

function logToConsoleElement() {
	var con = getConsoleElement();
	con.value = con.value + JSON.stringify(arguments) + '\n';
}

function getConsoleElement() {
	return document.getElementById('Console');
}

/*
	CONSOLE:   END
*/


/*
	EXAMPLE LIB: BEGIN
*/

JsConsoleLib = (function() {
	return {
		/**
		 * FROM WfUtils.js in wfWebEvents => https://stackoverflow.com/a/2117523/1003157
		 */
		createUuid: function() {
			return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
				(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
			);
		}
	}
})();

/*
	EXAMPLE LIB:   END
*/
