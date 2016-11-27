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

	prepareCanvas();
};

/* Event Listeners */
$("#undoBtn").click(function(e) {
	undo();
});

$("#clearBtn").click(function(e) {
	clear();
});

/* Tool Listeners*/
$("#subtools div").click(function(e) {
	type = $(this)[0].className;
});

/* Stamp and Brush Mechanic */
var stamp = new Image();
var type = "brush";

function prepareCanvas() {
	stamp.src = "images/stamps/cat.png";
}

/* Simple Drawing Mechanic */
var clickHist = [];
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickType = new Array();
var paint;

function addClick(x,y,dragging) {
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
	clickType.push(type);
}

function redraw() {
	context.clearRect(0,0,context.canvas.width, context.canvas.height);

	context.strokeStyle = "#df4b26";
	context.lineJoin = "round";
	context.lineWidth = 5;

	for(var i = 0; i < clickX.length; i++) {
		if(clickType[i] == "stamp") {
			context.drawImage(stamp, clickX[i]-50, clickY[i]-50, 100, 100);
		} else {
			context.beginPath();
			if(clickDrag[i] && i) {
				context.moveTo(clickX[i-1], clickY[i-1]);
			} else {
				context.moveTo(clickX[i]-1, clickY[i]);
			}
			context.lineTo(clickX[i], clickY[i]);
			context.closePath();
			context.stroke();
		}
	}
}

function clear() {
	context.clearRect(0,0,context.canvas.width, context.canvas.height);
	clickX = new Array();
	clickY = new Array();
	clickDrag = new Array();
	clickType = new Array();
	clickHist.push({
		"clickX": clickX.slice(),
		"clickY": clickY.slice(),
		"clickDrag": clickDrag.slice(),
		"clickType": clickType.slice()
	});
}

/* Handle undo functionality */
function redrawHistory() {
	var item = clickHist.slice(-1).pop();
	clickX = item["clickX"].slice();
	clickY = item["clickY"].slice();
	clickDrag = item["clickDrag"].slice();
	clickType = item["clickType"].slice();
	redraw();
}

function undo() {
	clickHist.pop();
	if(clickHist.length > 0) {
		redrawHistory();
	} else if(clickHist.length == 0) {
		clear();
	} else {
		console.log("Nothing left to undo.");
	}
}

/* Mouse Listeners */

$("#mainCanvas").mousedown(function(e) {
	paint = true;
	if(type != "stamp") {
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		addClick(mouseX, mouseY);
		redraw();
	}
});


$("#mainCanvas").mousemove(function(e) {
	if(paint && type != "stamp") {
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		addClick(mouseX, mouseY, true);
		redraw();
	}
});


$("#mainCanvas").mouseup(function(e) {
	if(paint) {
		if(type == "stamp") {
			var mouseX = e.pageX - this.offsetLeft;
			var mouseY = e.pageY - this.offsetTop;
			addClick(mouseX, mouseY);
			redraw();
		}
		paint = false;
		clickHist.push({
			"clickX": clickX.slice(),
			"clickY": clickY.slice(),
			"clickDrag": clickDrag.slice()
		});
	}
});

$("#mainCanvas").mouseleave(function(e) {
	if(paint) {
		paint = false;
		clickHist.push({
			"clickX": clickX.slice(),
			"clickY": clickY.slice(),
			"clickDrag": clickDrag.slice()
		});
	}
});
