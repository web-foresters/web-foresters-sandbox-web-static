function getCanvas() {
	return document.getElementById("MyCanvas");
}

function get$Canvas() {
	return $('#MyCanvas');
}
// Mouse Events - BEGIN
get$Canvas().on('mousedown', canvasMousePressed);

function canvasMousePressed() {
	if (pi) {
		pi.mouseIsPressed = true;
	}
}
get$Canvas().on('mouseup', canvasMouseNotPressed);

function canvasMouseNotPressed() {
	if (pi) {
		pi.mouseIsPressed = false;
	}
}
// Mouse Events - END
// Key Events - BEGIN
get$Canvas().on('keydown', canvasKeyPressed);

function canvasKeyPressed() {
	if (pi) {
		pi.keyIsPressed = true;
	}
}
get$Canvas().on('keyup', canvasKeyReleased);

function canvasKeyReleased() {
	if (pi) {
		pi.keyIsPressed = false;
	}
}
// Key Events - END
var sketchProc = function(processingInstance) {
	with(processingInstance) {
		var draw = function() {};
		size(400, 400);
		frameRate(30);

		// ProgramCodeGoesHere
		fill(255, 255, 0);
		ellipse(200, 200, 200, 200);
		noFill();
		stroke(0, 0, 0);
		strokeWeight(2);
		arc(200, 200, 150, 100, 0, PI);
		fill(0, 0, 0);
		ellipse(250, 200, 10, 10);
		ellipse(153, 200, 10, 10);
	}
};

// Get the canvas that Processing-js will use
var canvas = getCanvas();
// Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
var processingInstance = new Processing(canvas, sketchProc);

function showSecondCanvas() {
	var sketchProc = function(processingInstance) {
		var pi = processingInstance;
		pi.draw = function() {};
		//	       with (processingInstance) {
		//	       (function(pi) {
		pi.size(400, 400);
		pi.frameRate(30);

		// ProgramCodeGoesHere
		pi.fill(255, 25, 111);
		pi.ellipse(200, 200, 200, 200);
		pi.noFill();
		pi.stroke(0, 0, 0);
		pi.strokeWeight(2);
		pi.arc(200, 200, 150, 100, 0, pi.PI);
		pi.fill(0, 0, 0);
		pi.ellipse(250, 200, 10, 10);
		pi.ellipse(153, 200, 10, 10);
		pi.textSize(20);
		pi.text("This is the second canvas.", 90, 50);
	}; //    }(processingInstance));

	// Get the canvas that Processing-js will use
	var canvas = getCanvas();
	// Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
	var processingInstance = new Processing(canvas, sketchProc);
}

function getEditor() {
	return document.getElementById("Editor");
}

function get$Editor() {
	return $('#Editor');
}

get$Editor().on('keydown', editorKeyPressed);

function editorKeyPressed(keyEvent) {
//	console.log('Editor Key Pressed', keyEvent);
	if (keyEvent.keyCode === 9) {
		var $editor = get$Editor();
//		console.log('TAB PRESSED: selected text = ' + getSelectionText(), 'selection at ' + JSON.stringify(selection));
		indent($editor);
		return false;
	}
}

get$Editor().on('keyup', editorKeyReleased);

function editorKeyReleased(keyEvent) {
//	console.log('Editor Key Pressed', keyEvent);
	if (keyEvent.keyCode === 9) {
		return false;
	}
}


function indent($textarea) {
	var allCode = breakupCode($textarea);
	var selectionOffsets = getTaSelectionOffsets($textarea);
	var modified = allCode.priorLines ? allCode.priorLines : ''; 
	var selectedLinesArr = allCode.selectedLines.split('\n');
	selectedLinesArr.forEach((line, idx) => modified = modified + (idx > 0 ? '\n' : '') + '\t' + line);
//	modified = modified.substring(0, modified.length - 1);
	modified = modified + (allCode.laterLines ? allCode.laterLines : '');
	$textarea.val(modified);
	$textarea.prop({ 'selectionStart': selectionOffsets.start + 1, 'selectionEnd': selectionOffsets.end });
//	console.log("Selected Lines[]", selectedLinesArr);
//	$textarea.val(allCode.priorLines + allCode.laterLines);
//	$textarea.val(oldVal.substring(0, Offsets.start) + '\t' + oldVal.substring(Offsets.start));
}

function breakupCode($textarea) {
	var oldVal = $textarea.val();
	var selectionLineOffsets = getTaSelectionLineOffsets($textarea, oldVal);
	var result = {
		priorLines: getPriorLines(oldVal, selectionLineOffsets.start),
		selectedLines: getSelectedLines(oldVal, selectionLineOffsets),
		laterLines: getLaterLines(oldVal, selectionLineOffsets.end)
	};
	console.log('Prior lines = "' + result.priorLines + '"');
	console.log('Selected lines = "' + result.selectedLines + '"');
	console.log('Later lines = "' + result.laterLines + '"');
	return result;
}

function getPriorLines(text, lineOffset) {
//	console.log('Selection starts at ' + startLineOffset + ' for char at ' + selectionStartOffset);
	return (lineOffset === 0) ? "" : text.substring(0, lineOffset);
}

function getSelectedLines(text, selectionLineOffsets) {
//	console.log('Selection starts at ' + startLineOffset + ' for char at ' + selectionStartOffset);
	return text.substring(selectionLineOffsets.start, selectionLineOffsets.end + 1);
}

function getLaterLines(text, lineOffset) {
//	console.log('Selection ends at ' + endLineOffset + ' for char at ' + selectionEndOffset);
	return (lineOffset === text.length - 1) ? "" : text.substring(lineOffset + 1);
}

function findLineBeginning(text, offset) {
	var result = offset - 1;
	while (result >= 0 && text.charAt(result) !== '\n') {
		result--;
	}
	return result + 1;
}

function findLineEnding(text, offset) {
	var endOfText = text.length - 1;
	var result = offset;
	while (result <= endOfText && text.charAt(result) !== '\n') {
		result++;
	}
	return result - 1;
}

function getTaSelectionLineOffsets($textarea, text) {
	var charOffsets = getTaSelectionOffsets($textarea);
	return { start: findLineBeginning(text, charOffsets.start), end: findLineEnding(text, charOffsets.end) };
}

function getTaSelectionOffsets($textarea) {
	return {
		start: $textarea.prop("selectionStart"),
		end: $textarea.prop("selectionEnd")
	};
}

