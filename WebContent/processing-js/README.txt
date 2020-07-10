//**********************
// Mouse/Key Checking
//**********************

var canvasWidth = 400;
var canvasHeight = 400;
var faceCenter = 10;

size(canvasWidth, canvasHeight); 
frameRate(30);

var draw = function() {
    background(80, 80, 80);
    text('Mouse pressed = ' + mouseIsPressed, 10, 10);
	text('Key pressed = ' + keyIsPressed, 10, 80);
};





//**********************
// Image loading/display
//**********************

var canvasWidth = 300;
var canvasHeight = 400;
var faceCenter = 10;
var img = loadImage("../images/ddd.png");

size(canvasWidth, canvasHeight); 
frameRate(30);
var draw = function() {	
	image(img, 60, 60, 180, 180);
	noLoop();	
}
