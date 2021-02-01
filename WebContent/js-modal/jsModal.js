// Make modal
var elem = document.createElement('div');
elem.style.cssText = 'position:fixed; top:0px; left:0px; width:100%; height:100%; opacity:0.9; z-index:1000; background:#000;';
document.body.appendChild(elem);


// Make modal with contents and ability to close it by clicking on it!

/*
Hello Engineer,  this will open a modal dialog on your browser offering you a chance to take a quick break.  Enjoy!

	1. Copy this code
	2. Open your browser to any web page
		*  Please don't use on a page that is not static: has not been tested  *
		*  Google search page should be safe *
	3. Open DevTools [ Cmd-Option-i ]
	4. Paste this code onto the console
	5. Run it
	6. Click it 3 times (it will remove all existence from the page once done)
*/
// BEGIN COPY  .............
(function() {
	var elem = document.createElement('div');
	elem.style.cssText = 'position:fixed; top:0px; left:0px; width:100%; height:100%; opacity:0.98; z-index:2300; background:#000;';
	document.body.appendChild(elem);
	elem.style.color = 'yellow';
	elem.style.textAlign = 'center';
	function makeHeader(text) {
		var result = document.createElement('h1');
		result.textContent = text;
		result.style.opacity = 1;
		result.style.fontSize = '6vh';
		return result;
	}
	var mainHeader = makeHeader('Break Time -  Click to close this!');
	mainHeader.style.marginTop = '20%';
	elem.appendChild(mainHeader);
	var modelHitCount = 0;
	function getHitMessage(hitCount) {
		if (hitCount === 1) {
			return '1st Click: please rest a little longer.';
		} else if (hitCount === 2) {
			return '2nd Click: please rest one more time.';
		}
		// This should not happen, developer: add a new message for each count!
		return 'You clicked me ' + modelHitCount + ' time' + (modelHitCount === 1 ? '' : 's') + '!  Take a longer break :)'
	}
	elem.addEventListener('click', function() {
		modelHitCount++;
		if (modelHitCount === 3) {
			elem.appendChild(makeHeader('Hope you enjoyed your break.  See you next time...'));
			setTimeout(function() { elem.parentNode.removeChild(elem); }, 2000);
		} else {
			elem.appendChild(makeHeader(getHitMessage(modelHitCount)));
			elem.style.opacity = elem.style.opacity * 0.9;
		}
	});
})();
// ............  END COPY





// Version as a simple function displaying the given message
function displayModal(message) {
	function makeCenteredDiv() {
		var result = document.createElement('div');
		result.style.cssText = 'display: flex; justify-content: center; align-items: center; height: 100%;'; 
		return result;
	}
	var modal = document.createElement('div');
	modal.style.cssText = 'position:fixed; top:0px; left:0px; width:100%; height:100%; opacity:0.98; z-index:2300; background:#000;';
	document.body.appendChild(modal);
	modal.style.color = 'yellow';
	modal.style.textAlign = 'center';
	var msgDiv = makeCenteredDiv();
	msgDiv.textContent = message;
	modal.appendChild(msgDiv);
	modal.addEventListener('click', function() {
		modal.parentNode.removeChild(modal);
	});
}
