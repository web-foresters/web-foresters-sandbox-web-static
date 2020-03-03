D3Script = (function() {
	this.WfCombo = function(keyPattern) {
		/**
		 * Use keyPattern & getKey() to create specific keys for this combo's items.  keyPattern should return 1 group.  getKey() will
		 * return keys for setting attributes or styles.
		 * 
		 * For example, entry { "position1" : new XY(20, 30) } calling getKey('position1', 'x') returns 'x1'.
		 */
		this.keyPattern = keyPattern;
		var keyRegexp = new RegExp(keyPattern, 'g');
		this.getKey = function(baseKey, prefix, suffix) {
			var match = keyRegexp.exec(baseKey);
			keyRegexp.lastIndex = 0;
			return ((prefix == null) ? '' : prefix) + ((match === null) ? '' : match[1]) + ((suffix == null) ? '' : suffix);
		};
		/**
		 * This is called sending the "Key" this object was the value for inside the owning object.
		 * 
		 * This way a single Combo is associated with a specific set of attributes.  { 'p2' : new XY(66, 20) } sets 'x2' to 66 & 'y2' to 20.
		 */
		this.keys = function(ownerKey) {};
	};

	this.XY = function(x, y) {
		WfCombo.call(this, '^[^0-9]*([0-9]+)$');
		this.keys = function(ownerKey) {
			var result = {};
			result[this.getKey(ownerKey, 'x')] = x;
			result[this.getKey(ownerKey, 'y')] = y;
			return result;
		};
	};
	this.XY.prototype = Object.create(WfCombo.prototype);

	const STYLE_KEYS = ["background-color", "stroke", "stroke-width"];
	var configSvgItem = function(entity, options) {
		Object.keys(options).forEach(key => {
			configSvgItemKey(entity, key, options[key]);
			console.log(key + " => " + options[key]);
		})
		return entity;
	};
	var configSvgItemKey = function(entity, key, value) {
		if (value instanceof this.WfCombo) {
			console.debug('Setting attr/style with WfCombo: ', key, value);
			var items = value.keys(key);
			Object.keys(items).forEach(itemKey => configSvgItemKey(entity, itemKey, items[itemKey]));
			return;
		}
		if (STYLE_KEYS.includes(key)) {
			entity.style(key, value);
		} else {
			entity.attr(key, value);
//console.log('entity "' + key + '" = "' + value + '" / "' + entity.attr(key) + '"'); 
		}
	};

	// This works for DOM elements like 'svg', but not for 'Line' (Selection)
	var listAttributes = function(element) {
		var result = [];
		for (let key in element) {
		  result.push(key)
		};
		return result;
	};

	/**
	 * For way to reduce code such as jQuery css({ key:value, key:value... }) see:
	 * https://stackoverflow.com/questions/20822466/how-to-set-multiple-attributes-with-one-value-function
	 */
	this.drawLine = function() {
		const svg = d3.select('#svg1')
		    .attr('width', 400)
		    .attr('height', 400)
		    .style('background-color', 'black');
		console.info(svg);
		svg.append('line')
		    .style("stroke", "lightgreen")
		    .style("stroke-width", 10)
		    .attr("x1", 0)
		    .attr("y1", 0)
		    .attr("x2", 200)
		    .attr("y2", 200);
	};
	/**
	 * See https://stackoverflow.com/a/38209449/1003157
	 */
	this.drawLineMulti = function() {
		const svg = d3.select('#svg2')
		    .attrs({ 'width': 400, 'height': 400 })
		    .style('background-color', 'black');
		console.info(svg);
		svg.append('line')
			.styles({ "stroke": "blue", "stroke-width": 6 })
			.attrs({
				"x1": 400,
				"y1": 0,
				"x2": 200,
				"y2": 200
		});
	};
	/**
	 * See https://stackoverflow.com/a/38209449/1003157
	 */
	this.drawLineWf = function() {
		const svg = configSvgItem(d3.select('#svg2'), { 'width': 400, 'height': 400, 'background-color': 'black' });
		console.info(svg);
		var line = svg.append('line');
		configSvgItem(line, { "stroke": "blue", "stroke-width": 6, "p1" : new XY(400, 0), "p2" : new XY(200, 200) });
	};
	// Looks like jQuery does not help with D3/SVG...
	this.$drawLine = function() {
		const $svg = $('#svg2')
		    .css({
		    		'width': 400,
		    		'height': 400,
		    		'background-color': 'black'
		    });
		console.info($svg);
		var line = $svg[0].append('line');
//		$line.appendTo($svg);
	    line.attr({
	    	'stroke': 'lightgreen',
	    	'stroke-width': 10,
	    	'x1': 0,
	    	'y1': 0,
	    	'x2': 200,
	    	'y2': 200
	    });
	};

	return {
		drawLineWf: function() {
			return drawLineWf();
		},
		drawLineMulti: function() {
			return drawLineMulti();
		},
		drawLine: function() {
			return drawLine();
		},
		$drawLine: function() {
			return $drawLine();
		},
	}
})();	// END D3Script

const data = { message: 'Hello world' };
$('#msg').html(data.message);
console.log(data);
