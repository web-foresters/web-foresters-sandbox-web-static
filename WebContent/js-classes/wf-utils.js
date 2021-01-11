/*
 * License: 2020 Web Foresters, LLC (Michigan USA)
 * 
 * Author: Raymond Naseef
 */
WfUtils = (function() {
	var $local = window.$321 || window.$;
	
	/**
	 * Returns true if given argument is instance of Window
	 */
	function _isWindow(arg) {
		if (!arg) {
			return false;	// Quick return to simplify code
		}
		var result = arg instanceof Window;
		// Returns true if arg is instanceof any frame's window, not this global Window
		if (!result && arg.top) {
			result = arg.top === window.top;
		}
		return result;
	}
	
	function _getScrollHeight($scrollable) {
		// Get full scroll height of the scrollable (browser portability)
	/*	var result = $scrollable.prop("clientHeight");
		if ((result == null) || isNaN(result)) {
			result = $scrollable.prop("scrollHeight");
		}
	*/	var result = $scrollable.prop("scrollHeight");
		if ((result == null) || isNaN(result)) {
			// scrollable height on screen unknown: returning null
			// NOTE: 'result == null' above does not guarantee 'result === null'
			result = null;
		}
		return result;
	}
	
	function _getScrollWidth($scrollable) {
		// Get full scroll width of the scrollable (browser portability)
	/*	var result = $scrollable.prop("clientWidth");
		if ((result == null) || isNaN(result)) {
			result = $scrollable.prop("scrollWidth");
		}
	*/	var result = $scrollable.prop("scrollWidth");
		if ((result == null) || isNaN(result)) {
			// scrollable width on screen unknown: returning null
			// NOTE: 'result == null' above does not guarantee 'result === null'
			result = null;
		}
		return result;
	}
	
	function _getScrollLengthX($scrollable) {
		var result = _getScrollWidth($scrollable);
		return (result != null) ? result - $scrollable.innerWidth() : null;
	}
	
	function _getScrollLengthY($scrollable) {
		var result = _getScrollHeight($scrollable);
		return (result != null) ? result - $scrollable.innerHeight() : null;
	}
	
	
	function _fillOnScreen($element, xyBuffers) {
		var placingOffset = WfUtils.getPlacingOffset($element);
		var screenSize = { width : $local(window).width(), height : $local(window).height() };
		var newSizeCss = {};
		var xOverWidth = placingOffset.right + (xyBuffers && xyBuffers.x || 0) - screenSize.width;
		if (xOverWidth != 0) {
			newSizeCss.width = placingOffset.width - xOverWidth;
		}
		var xOverHeight = placingOffset.bottom + (xyBuffers && xyBuffers.y || 0) - screenSize.height;
		if (xOverHeight != 0) {
			newSizeCss.height = placingOffset.height - xOverHeight;
		}
		if (newSizeCss.width || newSizeCss.height) {
			$element.css(newSizeCss);
		}
	}
	
	function _getTemplate(templateId, fieldMap) {
		var result = $local('#' + templateId).html();
		if (result) {
			if (fieldMap) {
				for (var field in fieldMap) {
					var fieldValue = fieldMap[field];
					var regex = new RegExp('--' + escapeRegExp(field) + '--', 'g');
					result = result.replace(regex, fieldValue);
				}
			}
		}
		return result;
	}
	
	/**
	 * Returns number of the given month: January = 1, March = 3, jan = 1, jul = 7
	 */
	function _getMonthNumber(month) {
		this.MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
		month = month.toLowerCase();
		var result = this.MONTHS.indexOf(month) + 1;
		if (result === -1) {
			if (month.length > 2) {
				for (var m = 0; (m < 12) && (result < 1); m++) {
					var currentMonth = this.MONTHS[m];
					if (currentMonth.startsWith(month)) {
						result = m + 1;
					}
				}
			}
		}
		return result > 0 ? result : null;
	}
	
	var week = (function() {
		// Days of week in order - Date.getDay() returns 0 for Sunday
		this.DOW = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	
		/**
		 * Returns true if the given value is Day of week: Monday = true, tuesday = true, th = true
		 */
		function _verifyDayOfWeek(dow) {
			dow = dow.toLowerCase();
			var result = (this.DOW.indexOf(dow) !== -1);
			if (!result) {
				if (dow.length > 1) {
					for (var idx = 0; (idx < 7) && !result; idx++) {
						var currentDow = this.DOW[idx];
						if (currentDow.startsWith(dow)) {
							result = true;
						}
					}
				}
			}
			return result;
		}
	
		/**
		 * Returns Javascript number for the given Day of week: Sunday = 0, tuesday = 2, th = 4
		 */
		function _getDowIdx(dow) {
			dow = dow.toLowerCase();
			var result = this.DOW.indexOf(dow);
			if (result === -1) {
				for (var idx = 0; (idx < 7) && (result === -1); idx++) {
					var currentDow = this.DOW[idx];
					if (currentDow.startsWith(dow)) {
						result = idx;
					}
				}
			}
			return result;
		}
	
		return {
			verifyDayOfWeek: function(dow) {
				return _verifyDayOfWeek(dow);  
			},
			getDowIdx: function(day) {
				return _getDowIdx(day);
			}
		}
	})();
	
	/**
	 * Returns text in the given element.  Since GoDaddy uses complex child nodes breaking up the text
	 * and jQuery.text() loses whitespace between the children, this code walks the tree to put together
	 * text with whitespace.  This ignores <br/> nodes.
	 */
	function _getNodeText($node) {
		var result = null;
		$node.find('*').each(function() {
			var txt = '';
			var $childNodes = $local(this).contents().filter(function(){ 
					return this.nodeType == 3; 
				});
			// This may be overkill: need to make sure result has text node, but not sure it
			// will ever have more than 1 text node.
			for (var nodeIdx = 0; nodeIdx < $childNodes.length; nodeIdx++) {
				var nodeValue = $childNodes[nodeIdx].nodeValue;
				if (nodeValue.trim() !== '') {
					txt = (txt === '') ? nodeValue : txt + ' ' + nodeValue;
				}
			}
			if (txt !== '') {
				if (result === null) {
					result = txt;
				} else {
					result = result + ' ' + txt;
				}
			}
		});
		return result;
	}
	
	/**
	 * Sets CSS top & left of $node to place it in middle of the $container.  This may require $node
	 * having CSS 'position: absolute', and adjust can be offset of true parent of $node.  Doing that
	 * allows $node 'z-index' to be used to place it over elements that are higher than $container.
	 * 
	 * CRITICAL: both $node & $container must exist on the document for their widths & heights to be
	 * known.  Also, $node margins & borders are ignored, so those will adjust its position.
	 * 
	 * @param $node Element to place
	 * @param $container Element to center $node inside
	 * @param adjust offset to adjust the placement
	 */
	function _offsetMiddleOfContainer($node, $container, adjust) {
		if (adjust == null) {
			adjust = { top: 0, left: 0 };
		}
		var containerOffset = $container.offset();
		var addToCenterY = $container.innerHeight() - $node.innerHeight();
		if (addToCenterY < 0) { addToCenterY = 0; }
		var addToCenterX = $container.innerWidth() - $node.innerWidth();
		if (addToCenterX < 0) { addToCenterX = 0; }
		$node.css({'top' : containerOffset.top + addToCenterY - adjust.top, 'left' : containerOffset.left + addToCenterX - adjust.left});
	}
	
	/**
	 * Set CSS top & left of $node to place it in middle of it's parent.  If $node position is 'fixed' this will not work correctly.
	 * 
	 * @param $node Element to place
	 * @param adjust offset to adjust the placement
	 */
	function _putAtMiddleOfParent($node, adjust) {
		if (adjust == null) {
			adjust = { top: 0, left: 0 };
		}
		var $parent = $node.parent();
		var centerY = $parent.innerHeight() - $node.innerHeight();
		var centerX = $parent.innerWidth() - $node.innerWidth();
		$node.css({'top' : centerY - adjust.top, 'left' : centerX - adjust.left});
	}
	
	/**
	 * Escapes given arguments to valid contents for use in HTML tag text.  This allows putting dynamic
	 * text onto page without hacking.  Unlike escape(), encodeURI() & encodeURIComponent() this escapes
	 * for inclusion on HTML page (those methods escape for inclusion in URI).
	 * 
	 * For example, encodeHtml('<h1>Let\'s Hack</h1>') returns "&lt;h1&gt;Let's Hack&lt;/h1&gt;"
	 * 
	 */
	function _encodeHtml() {
		var result = '';
		var argCount = arguments.length;
		var $wrapper = $local('<p>');
		for (var argIdx = 0; argIdx < argCount; argIdx++) {
			result = result + $wrapper.text(arguments[argIdx]).html();
		}
		return result;
	}
	
	_urlQueryParser = (function() {
		// getAllUrlParams(url) FROM https://www.sitepoint.com/get-url-parameters-with-javascript/
		// RLN: added filter to only get values for the given parameter
		function _getAllUrlParams(url, desiredParam) {
			if (typeof desiredParam === 'string') {
				desiredParam = desiredParam.toLowerCase();
			} else {
				// Any other type = NO FILTERING
				desiredParam = false;
			}
	
			// get query string from url (optional) or window
			// RLN: modified logic to consider any String url as being complete; otherwise URL with no
			// search causing using window URL
	//		var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
			var queryString = (typeof url === 'string') ? url.split('?')[1] : window.location.search.slice(1);
	
			// we'll store the parameters here
			var obj = {};
	
			// if query string exists
			if (queryString) {
				// stuff after # is not part of query string, so get rid of it
				queryString = queryString.split('#')[0];
	
				// split our query string into its component parts
				var arr = queryString.split('&');
	
				for (var i=0; i<arr.length; i++) {
					// separate the keys and the values
					var a = arr[i].split('=');
	
					// in case params look like: list[]=thing1&list[]=thing2
					var paramNum = undefined;
					var paramName = a[0].replace(/\[\d*\]/, function(v) {
							paramNum = v.slice(1,-1);
							return '';
						});
	
					// set parameter value (use 'true' if empty)
					var paramValue = typeof(a[1])==='undefined' ? true : a[1];
	
					// (optional) keep case consistent
					paramName = paramName.toLowerCase();
					// RLN: skip paramName not matching filter
					if (desiredParam) {
						if (paramName !== desiredParam) {
							continue;
						}
					}
					// RLN FIX: wrapped to only operate on typeof === 'string'
					if (typeof paramValue === 'string') {
						paramValue = paramValue.toLowerCase();
					}
	
					// if parameter name already exists
					if (obj[paramName]) {
						// convert value to array (if still string)
						if (typeof obj[paramName] === 'string') {
							obj[paramName] = [obj[paramName]];
						}
						// if no array index number specified...
						if (typeof paramNum === 'undefined') {
							// put the value on the end of the array
							obj[paramName].push(paramValue);
						}
						// if array index number specified...
						else {
							// put the value at that index number
							obj[paramName][paramNum] = paramValue;
						}
					}
					// if param name doesn't exist yet, set it
					// RLN FIX: when paramValue is boolean, obj[paramName] has no push() failing if param is included again with string value: ?a&a=2
					else {
						obj[paramName] = [];
						obj[paramName].push(paramValue);
					}
				}
			}
	
			return obj;
		}
	
	
		return {
			/**
			 * Return object {param1Name: [value1,value2...], param2Name: ...} from given URL or window
			 * if URL is undefined|null.
			 */
			allForUrl: function(url) {
				return _getAllUrlParams(url);
			},
			allForWindow: function() {
				// TODO: check undefined parameter is correct, or if should pass something like null or ''
				return _getAllUrlParams();
			},
			/**
			 * Return results for the given parameter from given URL, from window if URL undefined|null.
			 * If param DNE or argument = undefined|null, result is undefined.
			 */
			paramForUrl: function(paramName, url) {
				if (typeof paramName === 'string') {
					paramName = paramName.toLowerCase();
				}
				return _getAllUrlParams(url, paramName)[paramName];
			},
			/**
			 * Return results for the given parameter from from window.
			 * If param DNE or argument = undefined|null, result is undefined.
			 */
			paramForWindow: function(paramName) {
				if (typeof paramName === 'string') {
					paramName = paramName.toLowerCase();
				}
				return _getAllUrlParams(null, paramName)[paramName];
			},
			/**
			 * Call this with 'paramValues' as result from paramForWindow() or paramForUrl() to verify if the result contains the
			 * requested value [paramValues.indexOf(requestedValue) > -1].
			 */
			paramContainsValue(paramValues, requestedValue) {
				return (paramValues instanceof Array) && paramValues.indexOf(requestedValue) > -1;
			}
		}
	})();
	
	
	/* Regex escape FROM https://stackoverflow.com/a/6969486/1003157 */
	var escapeRegExp;
	
	(function () {
	  // Referring to the table here:
	  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/regexp
	  // these characters should be escaped
	  // \ ^ $ * + ? . ( ) | { } [ ]
	  // These characters only have special meaning inside of brackets
	  // they do not need to be escaped, but they MAY be escaped
	  // without any adverse effects (to the best of my knowledge and casual testing)
	  // : ! , = 
	  // my test "~!@#$%^&*(){}[]`/=?+\|-_;:'\",<.>".match(/[\#]/g)
	
	  var specials = [
			// order matters for these
			  "-"
			, "["
			, "]"
			// order doesn't matter for any of these
			, "/"
			, "{"
			, "}"
			, "("
			, ")"
			, "*"
			, "+"
			, "?"
			, "."
			, "\\"
			, "^"
			, "$"
			, "|"
		  ]
	
		  // I choose to escape every character with '\'
		  // even though only some strictly require it when inside of []
		, regex = RegExp('[' + specials.join('\\') + ']', 'g')
		;
	
	  escapeRegExp = function (str) {
		return str.replace(regex, "\\$&");
	  };
	
	  // test escapeRegExp("/path/to/res?search=this.that")
	}());	// END escapeRegExp
	
	/**
	 * Returns console function (e.g. console.log) with given name.  Will look for matching function in
	 * each argument until one is found, so console error() DNE and log() exists will still log errors.
	 * 
	 * Ensures there is a function in case there if console OR all console[arg] functions DNE
	 */
	var getConsoleFn = function() {
		var result = null;
		if (typeof console !== 'undefined') {
			var argCount = arguments.length;
			for (var argIdx = 0; (argIdx < argCount) && (result === null); argIdx++) {
				var fname = arguments[argIdx];
				if (typeof console[fname] === 'function') {
					result = console[fname].bind(window.console);
				}
			}
		}
		return result ? result : function() {};
	}
	
	/**
	 * Returns closest ancestor limiting vertical overflow for this element; null if none
	 * found
	 */
	function _findVerticalOverflowWrapper($element) {
		var result = null;
		var $parent = $element.parent();
		while (($parent.length > 0) && (result === null)) {
			if ($parent[0] instanceof Document) {
				break;
			}
			if ($parent.css('overflow-y') !== 'visible') {
				result = $parent;
			}
			$parent = $parent.parent();
		}
		return result;
	}
	
	/**
	 * For user to 'download' a file - FROM: https://stackoverflow.com/a/33542499
	 * decodeURIComponent is addition in my code so filename & data can be safely stored in HTML
	 * attribute
	 * 
	 * NOTE: currently sets MIME text/calendar.  Needs changing if other mime supported
	 */
	function _downloadBlob(filename, encoded, data) {
		if (encoded) {
			filename = decodeURIComponent(filename);
			data = decodeURIComponent(data);
		}
		var blob = new Blob([data], {type:'text/calendar;charset=utf-8;'});
		if (window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveBlob(blob, filename);
		} else {
			// .replace(/^blob:http/,'webcal') will cause Safari to open this in iCalendar: does not work in Chrome
			var blobUrl = window.URL.createObjectURL(blob);
			var elem = window.document.createElement('a');
			elem.href = blobUrl;
			elem.download = filename;
			document.body.appendChild(elem);
			elem.click();
			document.body.removeChild(elem);
			window.URL.revokeObjectURL(blobUrl);
		}
	}
	
	/**
	 * Provides file download, similar to _downloadBlob().  Safari recognizes type of this file, but
	 * does not appear to recognize type of blob.
	 */
	function _downloadData(filename, encoded, data) {
		if (encoded) {
			filename = decodeURIComponent(filename);
		}
		var elem = window.document.createElement('a');
		elem.href = encodeURI('data:text/calendar;charset=utf8,') + data;
		elem.target = '_blank';
		elem.download = filename;
		document.body.appendChild(elem);
		elem.click();
		document.body.removeChild(elem);
	}
	
	/**
	 * FROM: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	 * 
	 * Returns a random number between min (inclusive) and max (exclusive)
	 */
	function getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	}
	
	/**
	 * FROM: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	 * 
	 * Returns a random integer between min (inclusive) and max (inclusive).
	 * The value is no lower than min (or the next integer greater than min
	 * if min isn't an integer) and no greater than max (or the next integer
	 * lower than max if max isn't an integer).
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	
	/**
	 * Creates new copy of the given array randomly sorted.
	 * 
	 * @param orig Array to create randomly sorted copy from
	 * @param filter function(element, newIdx) BOOLEAN : false does not add to new array
	 */
	function _randomSortArray(orig, filter) {
		filter = (typeof filter === 'function') ? filter : function() { return true; };
		var copy = orig.slice(0);
		var result = [];
		while (copy.length >= 1) {
			var removeIdx = (copy.length === 1) ? 0 : Math.floor(Math.random(copy.length) * copy.length);
			var item = copy.splice(removeIdx, 1)[0];
			if (!filter(item, result.length)) {
				continue;	// Skip
			}
			result.push(item);
		}
		return result;
	}
	
	/**
	 * Used to help user find part of text that needs attention.  For example:
	 * Call:   WfUtils.highlightCharIdx('123&56', 3, '-->', '<--')
	 * Result: 123-->&<--56
	 */
	function _highlightCharIdx(text, charIdx, prefix, suffix) {
		return text.substring(0, charIdx) + prefix + text.charAt(charIdx) + suffix + text.substring(charIdx + 1);
	}
	
	/**
	 * FROM: https://stackoverflow.com/a/28103073
	 */
	function _replaceLiterally(text, regexp, literalReplaceValue) {
		return text.replace(regexp, function () { return literalReplaceValue; });
	}
	
	var idSets = (function() {
		var addId = function(ids, id, allowDuplicates) {
			if (allowDuplicates == null) {
				allowDuplicates = false;
			}
			if (typeof id === 'string') {
				if ((id.indexOf('[') > -1) || (id.indexOf(']') > -1)) {
					WfUtils.logWarn('idSets behavior undefined when ID has "[" or "]" in it');
				}
			}
			var idKey = '[' + id + ']';
			if (!allowDuplicates) {
				if (ids.indexOf(idKey) > -1) {
					return ids;
				}
			}
			return ids + idKey;
		}
	
		var removeId = function(ids, id) {
			return ids.replace('[' + id + ']', '');
		}
	
		/**
		 * Returns IDs for all elements in a set.
		 * @param ids	String using pattern: [ID1][ID2]
		 */
		var getArray = function(ids) {
			var result = [];
			if (ids) {
				var idArray = ids.split(/[\[\]]+/);
				for (var idx in idArray) {
					var id = idArray[idx];
					if (id && id.length > 0) {
						result.push(id);
					}
				}
			}
			return result;
		}
	
		var arrayToSet = function(array, allowDuplicates) {
			var result = '';
			var itemCount = array.length;
			for (var idx = 0; idx < itemCount; idx++) {
				result = addId(result, array[idx], allowDuplicates);
			}
			return result;
		}
	
		return {
			version: '1.0',
			addId: function(ids, id, allowDuplicates) {
				return addId(ids, id, allowDuplicates);
			},
			removeId: function(ids, id) {
				return removeId(ids, id);
			},
			getArray: function(ids) { return getArray(ids); },
			arrayToSet: function(array, allowDuplicates) {
				return arrayToSet(array, allowDuplicates);
			}
		}
	})();
	
	/**
	 * FROM: https://stackoverflow.com/questions/34045777/copy-to-clipboard-using-javascript-in-ios
	 */
	function iosCopyToClipboard(el) {
		var oldContentEditable = el.contentEditable,
			oldReadOnly = el.readOnly,
			range = document.createRange();
	
		el.contenteditable = true;
		el.readonly = false;
		range.selectNodeContents(el);
	
		var s = window.getSelection();
		s.removeAllRanges();
		s.addRange(range);
	
		el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.
	
		el.contentEditable = oldContentEditable;
		el.readOnly = oldReadOnly;
	
		document.execCommand('copy');
	}

	// FROM: https://stackoverflow.com/a/59462028/1003157
	function copyElementToClipboard(element) {
		window.getSelection().removeAllRanges();
		let range = document.createRange();
		range.selectNode(typeof element === 'string' ? document.getElementById(element) : element);
		window.getSelection().addRange(range);
		document.execCommand('copy');
		window.getSelection().removeAllRanges();
	}
	
	function _getServerUrl(options, defaultProtocol, defaultHost, defaultPort) {
		var pr = options && options.protocol || defaultProtocol || 'http';
		var h = options && options.host || defaultHost || 'localhost';
		var po = options && options.port || defaultPort || 80;
		return pr + '://' + h + ':' + po;
	}
	
	/**
	 * Uploads given data to server for persistence: per-name this is for providing method to backup browser's local-storage for
	 * the given website.
	 */
	function exportLocalStorage(storageName, data, options) {
	/*	var xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://localhost:8080/WfRemoteStorage/exportLocalStorage', true);
	//    xhr.withCredentials = true;
		xhr.onreadystatechange = function() {
		  if (xhr.readyState === 2) {
			  // do something
		  }
		}
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(data);*/
		var url = _getServerUrl(options && options.server, 'http', 'localhost', 8080) + "/WfRemoteStorage/exportLocalStorage";
		WfUtils.log('Calling ' + url);
		$.ajax({
			type: 'post',
			cache: false,
	//		contentType: 'json',
			crossDomain: true,
			// This is the important part
			xhrFields: {
				withCredentials: false,
				'Access-Control-Allow-Origin': true
			},
			"headers": {
				  "Access-Control-Allow-Origin":"*"
			},
			url: url,
	//		dataType: 'json',
			data: {
				"storageName" : storageName,
				"data" :  JSON.stringify(data)
			},
			success: function(data, textStatus, jqXHR) {
				if (options && options.success) {
					options.success(data, textStatus, jqXHR, storageName, options);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				if (options && options.error) {
					options.error(data, jqXHR, textStatus, errorThrown, storageName, options);
				}
			}
		});
	}
	
	/**
	 * FROM: https://stackoverflow.com/a/25004941/1003157
	 * 
	 * Latter logic is to help tell if object is part of different version of jQuery (i.e. page running multiple jQuery versions)
	 */
	function isjQuery(obj) {
		return (obj && (obj instanceof jQuery || obj.constructor.prototype.jquery));
	}
	
	/**
	 * FROM: https://stackoverflow.com/a/3955096/1003157
	 */
	function removeA(arr) {
		var what, a = arguments, L = a.length, ax;
		while (L > 1 && arr.length) {
			what = a[--L];
			while ((ax= arr.indexOf(what)) !== -1) {
				arr.splice(ax, 1);
			}
		}
		return arr;
	}
	
	function showPopupMessage(msg) {
		var $msg = $('<span class="popupMessage"></span>');
		$msg.text(msg);
		$msg.appendTo(document.body);
		$msg.css({
			left: 'calc(50% - ' + ($msg.width() / 2) + 'px)',
			top: 'calc(50% - ' + ($msg.height() / 2) + 'px)',
			'font-size': 'large'
		});
		$msg.animate({ top: $(window).height(), opacity : '0' }, 3000, function() { $msg.remove(); });
	}

	/**
	 * Compares two strings and shows where they differ, using a format making it easy to find the difference
	 * in longer string.
	 */
	function quickDiffReport(stringA, stringB, reportIndent) {
		var expected = (typeof stringA === 'string') ? stringA : stringA.value;
		var actual = (typeof stringB === 'string') ? stringB : stringB.value;
		var expectedKey = stringA.key ? stringA.key : 'expected';
		var actualKey = stringB.key ? stringB.key : 'actual';
		function log(msg, arg1) {
			if (arg1) {
				console.log((reportIndent ? reportIndent : '') + msg, arg1);
			} else {
				console.log((reportIndent ? reportIndent : '') + msg);
			}
		}
		function showLeadingWhitespaceAsUnicode(text) {
			if (!text) {
				return; // Quick return if the text is empty
			}
			if (/\s/.test(text[0])) {
				return '[' + WfUtils.asUnicode(text.charCodeAt(0)) + ']' + (text.length > 1 ? text.substring(1) : '');
			} else {
				return text;
			}
		}
		function showTrailingWhitespaceAsUnicode(text) {
			if (!text) {
				return; // Quick return if the text is empty
			}
			var lastChar = text[text.length - 1];
			if (/\s/.test(lastChar)) {
				return (text.length > 1 ? text.substring(0, text.length - 1) : '') + '[' + WfUtils.asUnicode(lastChar.charCodeAt(0)) + ']';
			} else {
				return text;
			}
		}
		for (var idx = 0; idx < expected.length; idx++) {
			if ((actual.length === idx) || (expected[idx] !== actual[idx])) {
				log('matched ' + idx + ' chars:', idx > 0 ? showTrailingWhitespaceAsUnicode(expected.substring(0, idx)) : '');
				log(expectedKey + ' diff:', showLeadingWhitespaceAsUnicode(expected.substring(idx)));
				if (actual.length === idx) {
					var diff = (expected.length - actual.length);
					log(actualKey + ' is '
						+ diff + ' character' + (diff === 1 ? '' : 's') + ' shorter than ' + expectedKey + ': ',
						showLeadingWhitespaceAsUnicode(expected.substring(actual.length)));
				} else {
					log(actualKey + ' diff:', showLeadingWhitespaceAsUnicode(actual.substring(idx)));
				}
				return;
			}
		}
		var diff = (actual.length - expected.length);
		log(expectedKey + ' is '
			+ diff + ' character' + (diff === 1 ? '' : 's') + ' shorter than ' + actualKey + ': ',
			showLeadingWhitespaceAsUnicode(actual.substring(expected.length)));
	}

	return {
		version: '1.12',
		isjQuery(obj) {
			return isjQuery(obj);
		},
		findVerticalOverflowWrapper: function($element) {
			return _findVerticalOverflowWrapper($element);
		},
		// Scrolling
		/**
		 * @param $scrollable jQuery item holding scrollable element to find scroll height for
		 * @returns Scroll height if found - null if not found.
		 */
		getScrollHeight: function($scrollable) {
			return _getScrollHeight($scrollable);
		},
		/**
		 * @param $scrollable jQuery item holding scrollable element to find scroll width for
		 * @returns Scroll width if found - null if not found.
		 */
		getScrollWidth: function($scrollable) {
			return _getScrollWidth($scrollable);
		},
		/**
		 * @return Max $scrollable.scrollLeft() possible
		 */
		getScrollLengthX: function($scrollable) {
			return _getScrollLengthX($scrollable);
		},
		/**
		 * @return Max $scrollable.scrollTop() possible
		 */
		getScrollLengthY: function($scrollable) {
			return _getScrollLengthY($scrollable);
		},
		getScrollTop: function($scrollable) {
			return $scrollable.prop('scrollTop');
		},
		getScrollLeft: function($scrollable) {
			return $scrollable.prop('scrollLeft');
		},
		isWindow: function(arg) {
			return _isWindow(arg);
		},
		getTemplate: function(templateId, fieldMap) {
			return _getTemplate(templateId, fieldMap);  
		},
		getMonthNumber: function(month) {
			return _getMonthNumber(month);
		},
		verifyDayOfWeek: function(dow) {
			return week.verifyDayOfWeek(dow);  
		},
		getDowIdx: function(day) {
			return week.getDowIdx(day);
		},
		getNodeText: function($node) {
			return _getNodeText($node);
		},
		offsetMiddleOfContainer: function($node, $container, adjust) {
			_offsetMiddleOfContainer($node, $container, adjust);
		},
		putAtMiddleOfParent: function($node, adjust) {
			_putAtMiddleOfParent($node, adjust);
		},
		encodeHtml: function() {
			return _encodeHtml();
		},
		downloadBlob: function(filename, encoded, data) {
			_downloadBlob(filename, encoded, data);
		},
		downloadData: function(filename, encoded, data) {
			_downloadData(filename, encoded, data);
		},
		// For more extensive logging, see jquery.rln_js_console.js in Project (jquery-rln-js-console)
		log: getConsoleFn('log'),
		logDebug: getConsoleFn('debug', 'log'),
		logWarn: getConsoleFn('warn', 'log'),
		logError: getConsoleFn('error', 'log'),
		getNowMs: function() { return WfUtils.getTimeMs(new Date()); },
		getTimeMs: function(date) { return date.getTime(); },
		getInternationalDate: function(date) {
			date = date || new Date();
			var month = date.getMonth() + 1;
			var dom = date.getDate();
			return date.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (dom < 10 ? '0' : '') + dom;
		},
		urlQueryParser: _urlQueryParser,
		getRandomArbitrary: function(min, max) {
			return getRandomArbitrary(min, max);
		},
		getRandomInt: function(min, max) {
			return getRandomInt(min, max);
		},
		randomSortArray: function(orig, filter) {
			return _randomSortArray(orig, filter);
		},
		highlightCharIdx: function(text, charIdx, prefix, suffix) {
			return _highlightCharIdx(text, charIdx, prefix, suffix);
		},
		replaceLiterally: function(text, regexp, replacement) {
			return _replaceLiterally(text, regexp, replacement);
		},
		$version : function() {
			return $local().jquery;
		},
		idSets: idSets,
		iosCopyToClipboard: function(el) {
			iosCopyToClipboard(el);
		},
		copyElementToClipboard(element) {
			copyElementToClipboard(element);
		},
		exportLocalStorage(storageName, data, options) {
			exportLocalStorage(storageName, data, options);
		},
		/**
		 * TODO: check if this is being called and cleanup so this is not using $(this).text(...)
		 */
		formatDate(dateTimeValue) {
			var typeofValue = typeof dateTimeValue;
			var formatThisMs = null;	// Just using var to keep argument as entered to simplify debugging
			if (typeOfValue === 'number') {
				formatThisMs = dateTimeValue;
			} else if (typeOfValue === 'string') {
				formatThisMs = parseInt(typeOfValue, 10);
			} else if (typeOfValue === 'object') {
				if (dateTimeValue instanceof Date) {
					formatThisMs = dateTimeValue.getTime();
				}
			}
			if (isNaN(formatThisMs)) {
				WfUtils.logWarn(
						'Unable to format date/time as value "'
						+ formatThisMs
						+ '" not valid MS from argument "'
						+ dateTimeValue
						+ '" (typeof = "'
						+ typeOfValue
						+ '")');
				return dateTimeValue;
			}
			var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
			var displayValue = (new Date(parseInt(formatThisMs, 10) - tzoffset)).toISOString().slice(0, -1)
					.replace('T', ' ');
			// Remove year & seconds
			displayValue  = displayValue.substring(5, displayValue.lastIndexOf(':'));
			$this.text(displayValue);
		},
		removeArrayItems(arr) {	// Pass items to remove after the array
			return removeA.apply(null, arguments);
		},
		/**
		 * Returns {x,y} representing the middle of the element relative to its parent
		 */
		getMiddlePosition($element) {
			if (!isjQuery($element)) {
				$element = $(element);
			}
			return { x: $element.position().left + ($element.width() / 2), y: $element.position().top + ($element.height() / 2) };
		},
		/**
		 * Returns {x,y} representing the center of the element's top relative to its parent
		 */
		getTopCenterPosition($element) {
			if (!isjQuery($element)) {
				$element = $(element);
			}
			return { x: $element.position().left + ($element.width() / 2), y: $element.position().top };
		},
		/**
		 * Returns {x,y} representing the middle of the element relative to the document
		 */
		getMiddleOffset($element) {
			if (!isjQuery($element)) {
				$element = $(element);
			}
			return { x: $element.offset().left + ($element.width() / 2), y: $element.offset().top + ($element.height() / 2) };
		},
		/**
		 * Returns {x,y} representing the center of the element's top relative to the document
		 */
		getTopCenterOffset($element) {
			if (!isjQuery($element)) {
				$element = $(element);
			}
			return { x: $element.offset().left + ($element.width() / 2), y: $element.offset().top };
		},
		getPlacing(position, width, height) {
			var result = position;
			result.width = width;
			result.height = height;
			result.right = result.left + result.width;
			result.bottom = result.top + result.height;
			result.xPlace = function(percentage) {
				return result.left + ((result.right + result.left) * (percentage / 100));
			};
			result.yPlace = function(percentage) {
				return result.top + ((result.bottom + result.top) * (percentage / 100));
			};
			return result;
		},
		getPlacingOffset($element) {
			return this.getPlacing($element.offset(), $element.width(), $element.height());
		},
		getPlacingPosition($element) {
			return this.getPlacing($element.position(), $element.width(), $element.height());
		},
		getMoveDistanceTowardDestination(origLocation, destLocation, speedInPixels) {
			var xyDistances = {
				x: destLocation.x - origLocation.x,
				y: destLocation.y - origLocation.y
			};
			var fullDistance = Math.sqrt((xyDistances.x * xyDistances.x) + (xyDistances.y * xyDistances.y));
			var percentage = Math.min(speedInPixels / fullDistance, 1);
			var xMove = xyDistances.x * percentage;
			var yMove = xyDistances.y * percentage;
			return {
				moveX: xMove,
				moveY: yMove
			};
		},
		getLocationTowardDestination(origLocation, destLocation, speedInPixels) {
			var moves = WfUtils.getMoveDistanceTowardDestination(origLocation, destLocation, speedInPixels);
			return {
				x: origLocation.x + moves.moveX,
				y: origLocation.y + moves.moveY
			};
		},
		/**
		 * Moves element closer to destination location based on the given speed.  !!! All numbers must be relative to the same parent.
		 */
		// TODO: Cleanup - 1st not sure need percentage since speed & distances are both in pixels.
		moveTowardDestinationOffset($element, destLocation, speedInPixels) {
			if (!isjQuery($element)) {
				$element = $(element);
			}
			var oldMidLocation = WfUtils.getMiddleOffset($element);
			var newMidLocation = WfUtils.getLocationTowardDestination(oldMidLocation, destLocation, speedInPixels);
			var diffs = {
					x: newMidLocation.x - oldMidLocation.x,
					y: newMidLocation.y - oldMidLocation.y
			};
			// Setting top/left in CSS needs to use position, not offset
			var eTopLeft = $element.position();
			$element.css({
				'left': eTopLeft.left + diffs.x,
				'top': eTopLeft.top + diffs.y });
		},
		/**
		 * Moves element closer to destination location based on the given speed.  !!! All numbers must be relative to the same parent.
		 */
		// TODO: Cleanup - 1st not sure need percentage since speed & distances are both in pixels.
		moveTowardDestinationPosition($element, destLocation, speedInPixels) {
			if (!isjQuery($element)) {
				$element = $(element);
			}
			var eMiddle = WfUtils.getMiddlePosition($element);
			var location = WfUtils.getLocationTowardDestination(eMiddle, destLocation, speedInPixels);
			$element.css({
				'left': location.x + ($element.width() / 2),
				'top': location.y + ($element.height() / 2) });
		},
		/**
		 * grows/shrinks given element to fill the screen.  xyBuffers { x: #, y: # } will size it leaving the buffer space to the edges of the
		 * screen.
		 */
		fillOnScreen($element, xyBuffers) {
			_fillOnScreen($element, xyBuffers);
		},
		/**
		 * Shows the given message on a popup span that shows at screen center then fades away to bottom of
		 * the screen.  The message is in a fixed span with class "popupMessage"
		 */
		showPopupMessage: showPopupMessage,
		isBlank: function(str) {
			return (str == null) || (typeof str !== 'string') || (str.trim() === "");
		},
		degreesToRadians: function(degrees) {
			return Math.PI * degrees / 360;
		},
		quickDiffReport: function(expected, actual, reportIndent) {
			quickDiffReport(expected, actual, reportIndent);
		},
		removeItemFromArrayByValue(value) {
			return removeA(value);
		},
		/**
		 * FROM https://stackoverflow.com/a/2117523/1003157
		 * 
		 * Renamed function from uuidv4()
		 */
		createUuid: function() {
			return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
				(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
			);
		},
		/**
		 * Returns the filename replacing invalid characters with '-'.  This will modify chars that are valid in some OS
		 * but not in Windows or Linux.  It also trims the value since filenames cannot start or end with whitespaces
		 */
		validateFilename: function(filename) {
			const invalidChars = ['\\', '/', ':', ';', ',', '*', '?', '"', '<', '>', '|'];
			const spaceyChars = ['\t', '\n'];
			const ignoredChars = ['\r'];
			var result = '';
			filename = filename.trim();
			for (var chIdx = 0; chIdx < filename.length; chIdx++) {
				var ch = filename.charAt(chIdx);
				if (ignoredChars.indexOf(ch) !== -1) {
					continue;
				}
				if (spaceyChars.indexOf(ch) !== -1) {
					result += ' ';
				} else {
					if (invalidChars.indexOf(ch) !== -1) {
						result += '-';
					} else {
						result += ch;
					}
				}
			}
			return result;
		},
		/**
		 * Returns hex value of the given character code.  For example, WfUtils.asHex('j'.charCodeAt(0)) => '6A'
		 */
		asHex : function(charCode) {
			return charCode.toString(16).toUpperCase();
		},
		/**
		 * Returns string used to add the given code as literal in JavaScript.  See asHex()...
		 * 
		 * Example 'J': WfUtils.asUnicode('j'.charCodeAt(0)) => '\u006A'
		 * 
		 * Example '你 [nǐ]': WfUtils.asUnicode('你'.charCodeAt(0)) => '\u4F60'
		 */
		asUnicode : function(charCode) {
			var result = WfUtils.asHex(charCode);
			while (result.length < 4) {
				result = '0' + result;
			}
			return '\\u' + result;
		}
	}	// END WfUtils:return
})();	// END WfUtils


/**
 * Tools for unit testing & debugging
 */
WfUtilsDebug = (function() {
	function debugVerifyUrlsMatch(title, formUrl, objectUrl) {
		console.debug('BEGIN URL verification: ' + title);
		// Adding this as all other logging for this comparison will include info after the title
		title += '  ~-~-~-~  ';
		var contextErrorCount = 0;
		if (verifyUrlBeforeQuery(title, formUrl, objectUrl)) {
			console.debug('      URL contexts match (protocol/domain/path/anchors)');
		} else {
			contextErrorCount++;
		}
		var queryErrorCount = verifyUrlQueriesMatch(title, formUrl, objectUrl);
		var msgSuffix = 'URLs match: VERIFIED';
		if ((contextErrorCount > 0) || (queryErrorCount > 0)) {
			var totalErrorCount = contextErrorCount + queryErrorCount;
			msgSuffix = 'URLs have ' + (totalErrorCount) + ' error' + (totalErrorCount !== 1 ? 's' : '') + ': ';
			if (contextErrorCount > 0) {
				msgSuffix += contextErrorCount + ' in context' + ((queryErrorCount > 0) ? ' AND ' : '');
			}
			if (queryErrorCount > 0) {
				msgSuffix += queryErrorCount + ' in queries';
			}
		}
		// var msgSuffix = (queryErrorCount === 0)
		//         ? ' queries match: VERIFIED.'
		//         : ' queries have ' + queryErrorCount + ' error' + (queryErrorCount !== 1 ? 's' : '');
		console.debug('  END URL verification: ' + title + msgSuffix);
		return (contextErrorCount === 0) && (queryErrorCount === 0);
	}

	function verifyUrlBeforeQuery(title, urlA, urlB) {
		var contextA = urlA.split('?')[0];
		var contextB = urlB.split('?')[0];
		var result = contextA === contextB;
		if (!result) {
			console.error('\t' + title + ' contexts do not match.  See diff:');
			WfUtils.quickDiffReport({ key: 'contextA', value: contextA }, { key: 'contextB', value: contextB }, '\t');
		}
		return result;
	}

	function verifyUrlQueriesMatch(title, urlA, urlB) {
		const errorMsgPrefix = '\t' + title;
		var urlParsedA = _urlQueryParser.allForUrl(urlA);
		var urlParsedB = _urlQueryParser.allForUrl(urlB);
		var errorCount = 0;
		// 1) Check for value differences and missing fields in object results
		var formKeys = Object.keys(urlParsedA);
		var objectKeys = Object.keys(urlParsedB);
		for (var keyIdx = 0; keyIdx < formKeys.length; keyIdx++) {
			var key = formKeys[keyIdx];
			if (objectKeys.indexOf(key) === -1) {
				console.error(errorMsgPrefix + ' URL B is missing query parameter ' + key);
				errorCount++;
			} else {
				var diff = debugCompareArrays(urlParsedA[key], urlParsedB[key]);
				if (diff) {
					errorCount++;
					console.error(
						errorMsgPrefix + ' diff in query parameter ' + key,
						diff.msg,
						(diff.quickDiff) ? ' ... See Diff:' : '');
					if (diff.quickDiff) {
						WfUtils.quickDiffReport(
							{ key: 'urlA query parameter ' + key, value: diff.quickDiff[0] },
							{ key: 'urlB query parameter ' + key, value: diff.quickDiff[1] }, '\t');
					}
				}
			}
		}
		// 2) Check for missing fields in form results
		for (var keyIdx = 0; keyIdx < objectKeys.length; keyIdx++) {
			var key = objectKeys[keyIdx];
			if (formKeys.indexOf(key) === -1) {
				console.error(errorMsgPrefix + ' URL A is missing query parameter ' + key);
				errorCount++;
			}
		}
		if (errorCount > 0) {
			console.error(
				'\t' + title + ' found ' + errorCount + ' Query error' + (errorCount > 1 ? 's' : ''))//,
				// urlParsedA,
				// urlParsedB);
		}
		return errorCount;
	}

	function debugCompareArrays(a1, a2) {   // Returns first error that was found, null if they match
		if (a1.length !== a2.length) {
			return { msg: ['Arrays have different # of values.', a1, a2] };
		}
		for (var idx = 0; idx < a1.length; idx++) {
			var a1Value = a1[idx];
			var a2Value = a2[idx];
			if (a1Value !== a2Value) {
				return { msg: ['Value differs: ', a1Value, a2Value,],
						quickDiff: [a1Value, a2Value] };
			}
		}
		return null;
	}

	return {
		debugVerifyUrlsMatch: function(title, urlA, urlB) {
			return debugVerifyUrlsMatch(title, urlA, urlB);
		},
		/**
		 * This runs unit tests on its own code.
		 */
		runUnitTests: function(verbose) {
			runUnitTests(verbose);
		}
	}


	function runUnitTests(verbose) {
		runUnitTestsVerifyUrlsMatch();
		runUnitTestsValidateFilenames(verbose);
	}

	function runUnitTestsVerifyUrlsMatch() {
		var counts = { success: 0, fail: 0, total: 0 };
		function run(testName, formUrl, objectUrl, expectFail) {
			function fullUrl(query) { return 'http://dne/?' + query }
			if (formUrl.indexOf('?') === -1) { formUrl = fullUrl(formUrl); }
			if (objectUrl.indexOf('?') === -1) { objectUrl = fullUrl(objectUrl); }
			var result = debugVerifyUrlsMatch(testName, formUrl, objectUrl);
			counts.total++;
			if (result !== expectFail) { counts.success++; } else { counts.fail++; }
			return result;
		}
		console.debug('BEGIN Testing URL Verification Tools');
		run('unitTest 1 - EXPECT 1 ERROR FOR DIFF DOMAIN', 'http://dne/?a=hello', 'http://ghost/?a=hello', true);
		run('unitTest 2 - EXPECT 3 ERRORS (differ domain & params)', 'http://dne/?a=hello', 'http://ghost/?b=hello', true);
		run('unitTest 3 - match', 'a=hello', 'a=hello');
		run('unitTest 4 - EXPECT 1 ERROR parameter "a" value should differ', 'a=hello world', 'a=hello', true);
		run('unitTest 5 - EXPECT 1 ERROR (param diff count of entries)', 'http://dne/?a=hello&a=friend', 'http://dne/?a=hello', true);
		run('unitTest 6 - EXPECT 1 ERROR (anchors differ)', 'http://dne/#anchor?a=hello', 'http://dne/?a=hello', true);
		var endMsg = 'END   Testing URL Verification Tools with '
				+ counts.total + ' test' + ((counts.total !== 1) ? 's' : '') + ': '
				+ counts.success + ' successful';
		if (counts.fail > 0) {
			endMsg += ' and ' + counts.fail + ' failed';
			console.error(endMsg);
		} else {
			console.debug(endMsg);
		}
	}

	function runUnitTestsValidateFilenames(verbose) {
		var counts = { success: 0, fail: 0, total: 0 };
		function run(original, expected) {
			var actual = WfUtils.validateFilename(original);
			if (expected !== actual) {
				console.error('\tFilename not valid',
					{ original : original,
						expected: expected,
						actual: actual });
				counts.fail++;
			} else {
				if (verbose) {
					console.debug('\tFilename valid', { original: original, actual: actual });
				}
				counts.success++;
			}
			counts.total++;
		}
		console.debug('BEGIN Testing WfUtils.validateFilename()');
		// Run the tests
		run('abc.txt', 'abc.txt');
		run('Has bad "quotes"', 'Has bad -quotes-');
		run('  Starts with whitespace.bad', 'Starts with whitespace.bad');
		run('    Starts with tab & space.bad', 'Starts with tab & space.bad');
		run('Ends with tab & space.bad   ', 'Ends with tab & space.bad');
		run('Friends: many.bad', 'Friends- many.bad');
		run('Tabbing -\tTab 1\tTab 2.bad', 'Tabbing - Tab 1 Tab 2.bad');
		run('Long Tabs -\t\tTab 1\t\tTab 2.bad', 'Long Tabs -  Tab 1  Tab 2.bad');
		run('File with CRLN \r\n = change to 4 spaces.bad', 'File with CRLN   = change to 4 spaces.bad');
		run('Forward Slash \'/\'.bad', 'Forward Slash \'-\'.bad');
		run('Backward Slash \'\\\'.bad', 'Backward Slash \'-\'.bad');
		run('Colon : another colon :.bad', 'Colon - another colon -.bad');
		run('Semicolon ; in the wrong place haha.bad', 'Semicolon - in the wrong place haha.bad');
		run('Comma, for easier reading.bad', 'Comma- for easier reading.bad');
		run('* Stars *.bad', '- Stars -.bad');
		run('Any questions?.bad', 'Any questions-.bad');
		run('5 < 6.bad', '5 - 6.bad');
		run('5 > 6.bad', '5 - 6.bad');
		run('Forked |.bad', 'Forked -.bad');
		run('All bad chars 1\\2/3:4;5,6*7?8"9<0>10|.bad', 'All bad chars 1-2-3-4-5-6-7-8-9-0-10-.bad');
		run('Perfect filename.txt', 'Perfect filename.txt');
//        run('', '');
		// Finish Message
		var endMsg = 'END   Testing WfUtils.validateFilename() with '
				+ counts.total + ' test' + ((counts.total !== 1) ? 's' : '') + ': '
				+ counts.success + ' successful';
		if (counts.fail > 0) {
			endMsg += ' and ' + counts.fail + ' failed';
			console.error(endMsg);
		} else {
			console.debug(endMsg);
		}
	}
})();   // End WfUtilsDebug


WfPolyFills = (function() {
	var DEBUG = false;

	/**
	 * PolyFills
	 */
	function objectEntries(obj) {
		if (DEBUG) { console.debug('Wf PolyFill: Object.entries used'); }
		var ownProps = Object.keys(obj), entryCount = ownProps.length, result = new Array(entryCount);
		while (entryCount--) {
			result[entryCount] = [ownProps[entryCount], obj[ownProps[entryCount]]];
		}
		return result;
	};
	if (!Object.entries) {
		Object.entries = objectEntries;
	}

	// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	function objectKeys(obj) {
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty,
		hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
		dontEnums = [
			'toString',
			'toLocaleString',
			'valueOf',
			'hasOwnProperty',
			'isPrototypeOf',
			'propertyIsEnumerable',
			'constructor'
		],
		dontEnumsLength = dontEnums.length;

		if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
			throw new TypeError('Object.keys called on non-object');
		}
  
		var result = [], prop, i;
  
		for (prop in obj) {
			if (hasOwnProperty.call(obj, prop)) {
				result.push(prop);
			}
		}

		if (hasDontEnumBug) {
			for (i = 0; i < dontEnumsLength; i++) {
				if (hasOwnProperty.call(obj, dontEnums[i])) {
					result.push(dontEnums[i]);
				}
			}
		}
		return result;
	}
  	if (!Object.keys) {
		Object.keys = objectKeys;
	}

	return {
		version: '1.1',
		debug(newValue) {
			if (newValue != null) {
				DEBUG = newValue;
			}
			return DEBUG;
		},
		objectEntries: objectEntries,
		objectKeys: objectKeys
	}
})();



WfPolyFillsDebug = (function() {
	function runTests() {
		testObjectEntries();
		testObjectKeys();
	}

	function testObjectEntries() {
		function run(obj) {
			return JSON.stringify(WfPolyFills.objectEntries(obj));
		}
		var testNamePrefix = 'Object.entries() ';
		test(testNamePrefix + 'Empty object', run, {}, '[]');
		test(testNamePrefix + 'One property object', run, { onlyKey: 'onlyValue' }, '[["onlyKey","onlyValue"]]');
		test(testNamePrefix + 'Properties 1,2 object', run, { key1: 'value1', key2: 'value2' }, '[["key1","value1"],["key2","value2"]]');
		test(testNamePrefix + 'Properties 2,1 object', run, { key2: 'value2', key1: 'value1' }, '[["key2","value2"],["key1","value1"]]');
	}

	function testObjectKeys() {
		function run(obj) {
			return JSON.stringify(WfPolyFills.objectKeys(obj));
		}
		var testNamePrefix = 'Object.keys() ';
		test(testNamePrefix + 'Empty object', run, {}, '[]');
		test(testNamePrefix + 'One property object', run, { onlyKey: 'onlyValue' }, '["onlyKey"]');
		test(testNamePrefix + 'Properties 1,2 object', run, { key1: 'value1', key2: 'value2' }, '["key1","key2"]');
		test(testNamePrefix + 'Properties 2,1 object', run, { key2: 'value2', key1: 'value1' }, '["key2","key1"]');
	}

	function testDefault(testName, obj) {
		test(testName, obj, JSON.stringify(obj));
	}

	function test(testName, runner, obj, expected) {
		var actual = runner(obj)
		// Using stringify as quick/dirty way to quickly compare the arrays
		// See: https://masteringjs.io/tutorials/fundamentals/compare-arrays
		if (actual != expected) {
			console.error('test ' + testName + ' failed',
					'\n****  object:\n', obj,
					'\n\n****  expected:', expected,
					'\n\n****  actual:', actual);
			WfUtils.quickDiffReport({ key: 'expected', value: expected }, { key: 'actual', value: actual });
		} else {
			console.log('test ' + testName + ' succeeded');
		}
	}

	return {
		version: '1.1',
		runTests: runTests
	}
})();
