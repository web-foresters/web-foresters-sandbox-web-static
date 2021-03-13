/*


This is a simple paste-into-your-browser-console script that will remind you to take a break every 20 minutes.


NOTE: NOT WRITTEN YET.

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
