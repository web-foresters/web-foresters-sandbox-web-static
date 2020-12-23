WfHtmlCanvas = function(canvasId) {
	var $canvas = $('#' + canvasId);
	if ($canvas.length !== 1) {
		throw 'Canvas with ID "' + canvasId + '" not found.';
	}
	var ctx = $canvas[0].getContext('2d');

	this.XY = function(x, y) {
		return { x: x, y: y };
	}.bind(this);
	this.drawLine = function(pointA, pointB) {
		ctx.beginPath();
		ctx.moveTo(pointA.x, pointA.y);
//		ctx.strokeStyle = '#00FF00';
		ctx.lineTo(pointB.x, pointB.y);
		ctx.stroke();
	}.bind(this);
	this.getCanvas = function() {
		return $canvas[0];
	}.bind(this);
	this.getContext = function() {
		return ctx;
	}.bind(this);
};	// END WfHtmlCanvas


$(function() {
	var $canvas = $('#Canvas1');
	$canvas.css({ height: 300, width: 300 });
	var ctx = $canvas[0].getContext('2d');
	// Drawing 2 lines
	ctx.beginPath();
	// Draw 1st line in-place no scaling in green 2/3rd across and 1/2 down
	ctx.moveTo(0, 0);
	ctx.strokeStyle = '#00FF00';
	ctx.lineTo(200, 75);
	ctx.stroke();
	// Draw 2nd line moved (translate) and scaled 1/2 size
	ctx.translate(30, 30);
	ctx.moveTo(0, 0);
	ctx.scale(0.5, 0.5);
	ctx.strokeStyle = '#0000FF';
	ctx.lineTo(200, 75);
	ctx.stroke();
});
