var xRatio = 3;
var yRatio = 2;
var scale = 900;
var width = scale;
var height = (scale/xRatio) * yRatio;
var isLandscape = true;

var canvas, context;
var mainCard;

window.onload = function() {
	console.log("It begins.");
	canvas = document.getElementById("mainCanvas");
	context = canvas.getContext("2d");
	context.canvas.width = window.innerWidth;
	context.canvas.height = window.innerHeight;

	if(isLandscape) {
		mainCard = new Card(width, height);
	} else {
		mainCard = new Card(height, width);
	}

	prepareCanvas();
};

/* Stamp and Brush Mechanic */
var stamp = new Image();
var type = "stamp";

function prepareCanvas() {
	stamp.src = "images/stamps/cat.png";
}

/* Simple Drawing Mechanic */
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x,y,dragging) {
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
}

function redraw() {
	context.clearRect(0,0,context.canvas.width, context.canvas.height);

	context.strokeStyle = "#df4b26";
	context.lineJoin = "round";
	context.lineWidth = 5;

	for(var i = 0; i < clickX.length; i++) {
		context.beginPath();
		if(clickDrag[i] && i) {
			context.moveTo(clickX[i-1], clickY[i-1]);
		} else {
			context.moveTo(clickX[i]-1, clickY[i]);
		}
		context.drawImage(stamp, clickX[i]-50, clickY[i]-50, 100, 100);
		//context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		context.stroke();
	}
}

$("#mainCanvas").mousedown(function(e) {
	var mouseX = e.pageX - this.offsetLeft;
	var mouseY = e.pageY - this.offsetTop;

	if(type == "stamp") {
		paint = false;
	} else {
		paint = true;
	}
	addClick(mouseX, mouseY);
	redraw();
});

$("#mainCanvas").mousemove(function(e) {
	if(paint) {
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		addClick(mouseX, mouseY, true);
		redraw();
	}
});

$("#mainCanvas").mouseup(function(e) {
	paint = false;
});

$("#mainCanvas").mouseleave(function(e) {
	paint = false;
});

/* Card class describes the card and its current contents */
class Card {
	/* 2d array buffer for pixels on the card */
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.cardBuf = new Array(height);
		var i;
		for(i=0; i < height; i++) {
			this.cardBuf[i] = new Array(width);
		}
	}
}

/* Layer Class: Used when adding a new element to the card.
 * Cleared after completing addition to card.
 */
class Layer {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.previewBuf = new Array(height);
		var i;
		for(i=0; i < height; i++) {
			this.previewBuf[i] = new Array(width);
		}
	}
}
