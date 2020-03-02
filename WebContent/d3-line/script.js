D3Script = (function() {
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
		drawLine: function() {
			return drawLine();
		},
		drawLineMulti: function() {
			return drawLineMulti();
		},
		$drawLine: function() {
			return $drawLine();
		}
	}
})();	// END D3Script

const data = { message: 'Hello world' };
$('#msg').html(data.message);
console.log(data);
