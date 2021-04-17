// Initialize the Ace Editor

editor = ace.edit("Editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.on('change', editorChanged);

// Handle auto-restart with changes
function editorChanged(event) {
	console.log(event);
	runEditor();
}


	// FROM: https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text
function getSelectionText() {
	var text = "";
	var activeEl = document.activeElement;
	var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
	if (
	  (activeElTagName == "textarea") || (activeElTagName == "input" &&
	  /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
	  (typeof activeEl.selectionStart == "number")
	) {
		text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
	} else if (window.getSelection) {
		text = window.getSelection().toString();
	}
	return text;
}

/* 

	document.onmouseup = document.onkeyup = document.onselectionchange = function() {
			document.getElementById("sel").value = getSelectionText();
	};
*/
function runEditor() {
	try {
		_runEditor();
	} catch (err) {
		console.log(err);
	}
}

function togglePause() {
	if (!paused) {
		stopLooping();
	} else {
		continueLooping();
	}
}

function stopLooping() {
	try {
		if (pi) {
			pi.noLoop();
			setPaused(true);
		}
	} catch (err) {
		console.log(err);
	}
}

function continueLooping() {
	try {
		if (pi) {
			pi.loop();
			setPaused(false);
		}
	} catch (err) {
		console.log(err);
	}
}

var pi;
var piNumber = 0;
var paused = false;

function setPaused(isPaused) {
	paused = isPaused;
	$('#PauseButton').text(isPaused ? "CONTINUE" : "PAUSE");
}
function exitPi() {
	console.log("Exiting processor instance " + this.processorNumber);
	this._origExit();
}
function noOp() {}
function _runEditor() {
	var sketchProc = function(processingInstance) {
		piNumber++;
		console.log("Starting processor instance " + piNumber + " ... " + (pi ? pi.processorNumber : ''));
		var oldPi = pi;
		try {
			pi = processingInstance;
			pi.processorNumber = piNumber;
			pi._origExit = pi.exit;
			pi.exit = exitPi;
			pi.mouseIsPressed = false;
			pi.keyIsPressed = false;
			pi.getImage = pi.loadImage;
			pi.size(400, 400);
			pi._origSize = pi.size;
			pi.size = noOp;
			// Don't know how to use onPause/onLoop events or how to find out if PI is looping...
			pi.paused = false;
			pi._origNoLoop = pi.noLoop;
			pi.noLoop = function () {
				setPaused(true);
				pi._origNoLoop();
			};
			pi._origLoop = pi.loop;
			pi.loop = function () {
				setPaused(false);
				pi._origLoop();
			};
			with (pi) {
				eval(editor.getValue());
			}
			if (pi.draw) {
				pi._draw = pi.draw;
				pi.draw = function() {
					try {
						pi._draw();
					} catch (err) {
						console.log('pi.draw failed:', err);
						pi.noLoop();
					}
				}
			} else {
				pi.draw = noOp;
			}
		} catch (err) {
			console.log(err);
			pi.exit();
			pi = oldPi;
			return false;
		}
    	if (oldPi) {
    		oldPi.exit();
    	}
	};
	var canvas = getCanvas();
	try {
		new Processing(canvas, sketchProc); 
	} catch (err) {
		console.log(err);
	}
}

function changeFrameRate() {
	var fr = parseInt(document.getElementById('FrameRate').value, 10);
	if (fr > 0) {
    	pi.frameRate(fr);
		pi.loop();
	} else {
		pi.noLoop();
	}
}
