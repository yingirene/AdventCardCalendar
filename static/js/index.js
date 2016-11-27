/* Colors */
var colors = {
	"black" : "rgba(0,0,0,1)",
	"white" : "rgba(255,255,255,1)",
	"red" : "rgba(255,0,0,1)",
	"green" : "rgba(0,255,0,1)",
	"blue" : "rgba(0,0,255,1)",
	"yellow" : "rgba(255,255,0,1)",
	"magenta" : "rgba(255,0,255,1)",
	"cyan" : "rgba(0,255,255,1)"
};

var aspectRatio = 2/3; //yRatio/xRatio
var scale = 900;
var width = scale;
var height = scale * aspectRatio;
var isLandscape = true;

var canvas, context;
var bgImage = new Image();
var bgObj = {};

/* Brush Properties */
var stamp = new Image();
var type = "brush";
var value = colors["red"];
var brushSize = 5;

window.onload = function() {
	console.log("It begins.");
	$("#canvas").draggable({
		cursor: "move"
	});
	$("#canvas").draggable('disable');
	canvas = document.getElementById("mainCanvas");
	context = canvas.getContext("2d");
	context.canvas.width = width;
	context.canvas.height = height;

	prepareCanvas();
};

/* Event Listeners */
$("#undoBtn").click(function(e) {
	undo();
});

$("#clearBtn").click(function(e) {
	clear();
});

$("#uploadBtn").click(function(e) {
    $("#fileInput").click();
});

function handleFiles(e) {
	var file = e[0];
	var objectURL = window.URL.createObjectURL(file);
	bgImage.src = objectURL;
	bgImage.onload = function() {
		bgObj["srcWidth"] = bgImage.width;
		bgObj["srcHeight"] = bgImage.width * aspectRatio;
		bgObj["srcX"] = 0;
		bgObj["srcY"] = (bgImage.height - bgObj["srcHeight"])/2;
		redraw();
	}
}

/* Tool Listeners*/
$("#subtools div").click(function(e) {
	type = $(this)[0].className;
	if(type == "brush") {
		value = colors[$(this)[0].id];
	} else if(type == "size") {
		if($(this)[0].id == "inc") {
			brushSize++;
		} else {
			brushSize--;
		}
	}
});

/* Stamp and Brush Mechanic */
function prepareCanvas() {
	stamp.src = "images/stamps/cat.png";
}

/* Simple Drawing Mechanic */
var clickHist = [];
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickType = new Array();
var clickColor = new Array();
var clickBrushSize = new Array();
var paint;

function addClick(x,y,dragging) {
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
	clickType.push(type);
	clickColor.push(value);
	clickBrushSize.push(brushSize);
}

function redraw() {
	//context.clearRect(0,0,context.canvas.width, context.canvas.height);
	context.fillStyle = colors["white"];
	context.fillRect(0,0,context.canvas.width, context.canvas.height);
	if(Object.keys(bgObj).length > 0) {
		context.drawImage(bgImage,
			bgObj["srcX"], bgObj["srcY"], bgObj["srcWidth"], bgObj["srcHeight"],
			0,0,context.canvas.width, context.canvas.height);
	}

	context.lineJoin = "round";
	context.lineCap = "round";

	for(var i = 0; i < clickX.length; i++) {
		context.strokeStyle = clickColor[i];
		context.lineWidth = clickBrushSize[i];
		if(clickType[i] == "stamp") {
			context.globalCompositeOperation = "source-over";
			context.drawImage(stamp, clickX[i]-50, clickY[i]-50, 100, 100);
		} else {
			if(clickType[i] == "eraser") {
				context.globalCompositeOperation = "destination-out";
			} else {
				context.globalCompositeOperation = "source-over";
			}
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
	clickColor = new Array();
	clickHist.push({
		"clickX": clickX.slice(),
		"clickY": clickY.slice(),
		"clickDrag": clickDrag.slice(),
		"clickType": clickType.slice(),
		"clickColor": clickColor.slice(),
		"clickBrushSize": clickBrushSize.slice()
	});
}

/* Handle undo functionality */
function redrawHistory() {
	var item = clickHist.slice(-1).pop();
	clickX = item["clickX"].slice();
	clickY = item["clickY"].slice();
	clickDrag = item["clickDrag"].slice();
	clickType = item["clickType"].slice();
	clickColor = item["clickColor"].slice();
	clickBrushSize = item["clickBrushSize"].slice();
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
var isDrag = false;
$(window).keydown(function(e) {
	if(e.which == 32) {
		e.preventDefault();
		$("#canvas").draggable('enable');
		isDrag = true;
	}
});

$(window).keyup(function(e) {
	$("#canvas").draggable('disable');
	isDrag = false;
});

$("#mainCanvas").mousedown(function(e) {
	if(!isDrag) {
		paint = true;
		if(type != "stamp") {
			console.log($(this).offset().left);
			var mouseX = e.pageX - $(this).offset().left;
			var mouseY = e.pageY - $(this).offset().top;
			addClick(mouseX, mouseY);
			redraw();
		}
	}
});

$("#mainCanvas").mousemove(function(e) {
	if(paint && type != "stamp") {
		var mouseX = e.pageX - $(this).offset().left;
		var mouseY = e.pageY - $(this).offset().top;
		addClick(mouseX, mouseY, true);
		redraw();
	}
});

$("#mainCanvas").mouseup(function(e) {
	if(paint) {
		if(type == "stamp") {
			var mouseX = e.pageX - $(this).offset().left;
			var mouseY = e.pageY - $(this).offset().top;
			addClick(mouseX, mouseY);
			redraw();
		}
		paint = false;
		clickHist.push({
			"clickX": clickX.slice(),
			"clickY": clickY.slice(),
			"clickDrag": clickDrag.slice(),
			"clickType": clickType.slice(),
			"clickColor": clickColor.slice(),
			"clickBrushSize": clickBrushSize.slice()
		});
	}
});

$("#mainCanvas").mouseleave(function(e) {
	if(paint) {
		paint = false;
		clickHist.push({
			"clickX": clickX.slice(),
			"clickY": clickY.slice(),
			"clickDrag": clickDrag.slice(),
			"clickType": clickType.slice(),
			"clickColor": clickColor.slice(),
			"clickBrushSize": clickBrushSize.slice()
		});
	}
});
