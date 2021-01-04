
// Direct recursion
var callDepth = 0;
var $callDepth = null;
// Async recursion
var timeoutCallDepth = 0;
var timeoutStop = false;
var $timeoutCallDepth = null;

function pause() {
	alert('This dialog pauses all actions on the page.  Please close this to continue.');
}

function run() {
	if (!confirm('Please verify you want to run this: it may crash your browser.')) {
		return;
	}
	callDepth = 0;
	try {
		globalStackOverflow();
	} catch (err) {
		console.error('Expected error (stack overflow?) happened with call depth ' + callDepth, err.toString(), err);
	}
}

function globalStackOverflow() {
	callDepth++;
	setCallDepth(callDepth);
//	Math.random();
	globalStackOverflow();
}

function setCallDepth(value) {
	if ($callDepth === null) {
		 $callDepth = $('#CallDepth');
	}
	 $callDepth.text(value);
}

function runTimeoutStackOverflow() {
	try {
		timeoutCallDepth = 0;
		timeoutStop = false;
		timeoutStackOverflow();
	} catch (err) {
		console.error('Expected error (stack overflow?) happened with async call depth ' + timeoutCallDepth, err.toString(), err);
	}
}

function timeoutStackOverflow() {
	timeoutCallDepth++;
	if (timeoutStop === true) {
		console.log('Timeout Stack Overflow test stopped by user.');
		return;
	}
	setTimeoutCallDepth(timeoutCallDepth);
	setTimeout(timeoutStackOverflow, 0);
}

function stopTimeoutStackOverflow() {
	timeoutStop = true;
}

function setTimeoutCallDepth(value) {
	if ($timeoutCallDepth === null) {
		 $timeoutCallDepth = $('#TimeoutCallDepth');
	}
	$timeoutCallDepth.text(value);
}
