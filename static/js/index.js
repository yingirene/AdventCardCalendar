/* Colors */
var colors = {
	"clear" : "rgba(0,0,0,0)",
	"black" : "rgba(0,0,0,1)",
	"white" : "rgba(255,255,255,1)",
	"red" : "rgba(255,0,0,1)",
	"green" : "rgba(0,255,0,1)",
	"blue" : "rgba(0,0,255,1)",
	"yellow" : "rgba(255,255,0,1)",
	"magenta" : "rgba(255,0,255,1)",
	"cyan" : "rgba(0,255,255,1)"
};

var pipes = {
	"popcorn" : [
		"images/pipes/popcorn_1.png",
		"images/pipes/popcorn_2.png",
		"images/pipes/popcorn_3.png",
		"images/pipes/popcorn_4.png",
		"images/pipes/popcorn_5.png"
	]
};

var aspectRatio = 2/3; //yRatio/xRatio
var scale = 900;
var width = scale;
var height = scale * aspectRatio;
var isLandscape = true;

var canvas, context;

/* Brush Properties */
var stamp = new Image();
var stampScale = 0.1;
var degrees = 0;
var type = "brush";
var value = colors["red"];
var brushSize = 5;
var text = "";
var textStyle = "fill";
var pipeFrames = [];

var drawReverse = false;

/* Run when window loads */
window.onload = function() {
	console.log("It begins.");
	/* Display Brush Colors in subtool pane */
	$(".colors>div").each(function(e) {
		$(this)[0].style.backgroundColor = colors[$(this)[0].id];
		$(this)[0].style.color = colors[$(this)[0].id];
	});

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

function prepareCanvas() {
	stamp.src = "images/stamps/animal_cat.png";
}

/* Event Listeners */
$("#undoBtn").click(function(e) {
	undo();
});

$("#clearBtn").click(function(e) {
	clear();
});

function resetTools() {
	degrees = 0;
	brushSize = 5;
	drawReverse = false;
}

/* Tool Listeners*/
$(".colors div").click(function(e) {
	value = colors[$(this)[0].id];
});

var prevButton;

$("#customText").click(function(e) {
    e.preventDefault();
    $(".text").toggle();
    $("#inputText").toggle();
	if(prevButton != null) {
		prevButton.removeClass("selected");
	}
    $(this).addClass("selected");
	prevButton = $(this);
});

var tools = ["brush", "stamp", "eraser", "text", "pipe"];
var editableTools = ["stamp", "text", "pipe"];

/* Handle Main Tool Selection */

$(".specialTools>div").click(function(e) {
	var temp = $(this)[0].className;
	temp = temp.split(" ");
	if(tools.indexOf(temp[0]) >= 0) {
		type = temp[0];
		resetTools();
	}

	if($(this).parent()[0].id != "editTools") {
		var currButton = $(this);
		if($(this)[0].id == "inputText") {
			return;
		}
		if(prevButton != null) {
			if(prevButton[0].id == "customText" && prevButton != currButton) {
				$(".text").hide();
			    $("#inputText").hide();
			}
			prevButton.removeClass("selected");
		}
		if(!(currButton.hasClass("selected"))) {
			currButton.addClass("selected");
			prevButton = currButton;
		}
		resetTools();
	}

	switch(temp[0]) {
		case "eraser":
			value = colors["black"];
			break;
		case "text":
			$(".text").hide();
			$("#inputText").hide();
			text = $("#inputText textarea").val();
			$("#inputText textarea").val("");
			textStyle = $(this)[0].id;
			break;
		case "size":
			if($(this)[0].id == "inc") {
				brushSize++;
			} else {
				brushSize--;
			}
			break;
		case "rotate":
			if(editableTools.indexOf(type) >= 0) {
				if($(this)[0].id == "right") {
					degrees+=5;
				} else {
					degrees-=5;
				}
			}
			break;
		case "reverse":
			drawReverse = !drawReverse;
			break;
	}
});

/* Handle Secondary Tool Selection */

$(".otherTools>div").click(function(e) {
	var temp = $(this)[0].className;
	temp = temp.split(" ");
	if(tools.indexOf(temp[0]) >= 0) {
		type = temp[0];
		resetTools();
	}
	switch(temp[0]) {
		case "stamp":
			stamp.src = $(this).children()[0].src;
			$("mainCanvas").css({"cursor": "url(" + stamp.src + "), auto"});
			break;
		case "pipe":
			pipeFrames = pipes[$(this)[0].id].slice();
			break;
		case "frame":
			break;
	}
});

function getFrame() {
	return Math.floor(Math.random() * pipeFrames.length);
}

/* Simple Drawing Mechanic */
var clickHist = [];
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickType = new Array();
var clickColor = new Array();
var clickBrushSize = new Array();
var clickStamp = new Array();
var clickText = new Array();
var clickReverse = new Array();
var clickPipe = new Array();
var paint;

function addClick(x,y,dragging) {
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
	clickType.push(type);
	clickColor.push(value);
	clickBrushSize.push(brushSize);
	clickStamp.push([stamp.src, degrees]);
	clickText.push([text, textStyle]);
	clickReverse.push(drawReverse);
}

function redraw() {
	context.globalCompositeOperation = "source-over";
	context.clearRect(0,0,context.canvas.width, context.canvas.height);
	context.lineJoin = "round";
	context.lineCap = "round";

	for(var i = 0; i < clickX.length; i++) {
		if(clickType[i] == "eraser") {
			context.globalCompositeOperation = "destination-out";
		} else {
			context.globalCompositeOperation = "source-over";
		}
		context.strokeStyle = clickColor[i];
		context.lineWidth = clickBrushSize[i];
		if(clickType[i] == "stamp" || clickType[i] == "pipe") {
			context.save();
			var currStamp = new Image();
			currStamp.src = clickStamp[i][0];
			var scaledWidth = currStamp.width*stampScale*clickBrushSize[i];
			var scaledHeight = currStamp.height*stampScale*clickBrushSize[i];
			context.translate(clickX[i], clickY[i]);
			context.rotate(clickStamp[i][1]*Math.PI/180);
			if(clickReverse[i]) {
				context.scale(-1, 1);
				context.drawImage(currStamp, -(scaledWidth/2), -(scaledHeight/2), scaledWidth, scaledHeight);
				context.scale(-1, 1);
			} else {
				context.drawImage(currStamp, -(scaledWidth/2), -(scaledHeight/2), scaledWidth, scaledHeight);
			}
			context.restore();
		} else if(clickType[i] == "text") {
			context.save();
			context.globalCompositeOperation = "source-over";
			var currStamp = new Image();
			context.translate(clickX[i], clickY[i]);
			context.rotate(clickStamp[i][1]*Math.PI/180);
			context.font = (clickBrushSize[i] * 15) + "px serif";
			context.textAlign = "center";
			context.textBaseline = "middle";
			if(clickReverse[i]) {
				context.scale(-1, 1);
				if(clickText[i][1] == "fill") {
					context.fillText(clickText[i][0], 0, 0);
				} else {
					context.lineWidth = 1;
					context.strokeText(clickText[i][0], 0, 0);
				}
				context.scale(-1, 1);
			} else {
				if(clickText[i][1] == "fill") {
					context.fillText(clickText[i][0], 0, 0);
				} else {
					context.lineWidth = 1;
					context.strokeText(clickText[i][0], 0, 0);
				}
			}
			context.restore();
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
	clickColor = new Array();
	clickStamp = new Array();
	clickText = new Array();
	clickReverse = new Array();
	clickHist.push({
		"clickX": clickX.slice(),
		"clickY": clickY.slice(),
		"clickDrag": clickDrag.slice(),
		"clickType": clickType.slice(),
		"clickColor": clickColor.slice(),
		"clickBrushSize": clickBrushSize.slice(),
		"clickStamp": clickStamp.slice(),
		"clickText": clickText.slice(),
		"clickReverse": clickReverse.slice()
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
	clickStamp = item["clickStamp"].slice();
	clickText = item["clickText"].slice();
	clickReverse = item["clickReverse"].slice();
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
	if($("textarea").is(":focus")) {
		return;
	}
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
		if(type != "stamp" && type != "pipe") {
			var mouseX = e.pageX - $(this).offset().left;
			var mouseY = e.pageY - $(this).offset().top;
			addClick(mouseX, mouseY);
			redraw();
		}
	}
});

$("#mainCanvas").mousemove(function(e) {
	if(paint && type != "stamp" && type != "pipe") {
		var mouseX = e.pageX - $(this).offset().left;
		var mouseY = e.pageY - $(this).offset().top;
		addClick(mouseX, mouseY, true);
		redraw();
	}
});

$("#mainCanvas").mouseup(function(e) {
	if(paint) {
		if(type == "pipe") {
			stamp.src = pipeFrames[getFrame()];
		}
		if(type == "stamp" || type == "pipe") {
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
			"clickBrushSize": clickBrushSize.slice(),
			"clickStamp": clickStamp.slice(),
			"clickText": clickText.slice(),
			"clickReverse": clickReverse.slice()
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
			"clickBrushSize": clickBrushSize.slice(),
			"clickStamp": clickStamp.slice(),
			"clickText": clickText.slice(),
			"clickReverse": clickReverse.slice()
		});
	}
});

$("#uploadBtn").click(function(e) {
    $("#fileInput").click();
	bgIsColor = false;
});

/* BG image handlers */
$("#saveBtn a").click(function(e) {
	$(this).attr("href", saveImage());

});

/* Set selected image as current BG */
$(".bg").click(function(e) {
	bgImage.src = $(this).children()[0].src;
	bgImage.onload = function() {
		bgObj["srcWidth"] = bgImage.width;
		bgObj["srcHeight"] = bgImage.width * aspectRatio;
		bgObj["srcX"] = 0;
		bgObj["srcY"] = (bgImage.height - bgObj["srcHeight"])/2;
		if(bgObj["srcHeight"] > bgImage.height) {
			bgObj["srcWidth"] = bgImage.height/aspectRatio;
			bgObj["srcHeight"] = bgImage.height;
			bgObj["srcX"] = (bgImage.width - bgObj["srcWidth"])/2;
			bgObj["srcY"] = 0;
		}
	}
    $("#mainCanvas").css("background-image", "url(" + bgImage.src + ")");
	bgIsColor = false;
});

/* Save and Display BG color */
$("#fillBG").click(function(e) {
    $("#mainCanvas").css("background-image", "");
	$("#mainCanvas").css("background-color", value);
	bgColor = value;
	bgIsColor = true;
});

var bgImage = new Image();
var bgObj = {};
var bgColor = colors["white"];
var bgIsColor = true;

function handleFiles(e) {
	var file = e[0];
	var objectURL = window.URL.createObjectURL(file);
	$("#mainCanvas").css("background-image", "url(" + objectURL + ")");
	bgImage.src = objectURL;
	bgImage.onload = function() {
		bgObj["srcWidth"] = bgImage.width;
		bgObj["srcHeight"] = bgImage.width * aspectRatio;
		bgObj["srcX"] = 0;
		bgObj["srcY"] = (bgImage.height - bgObj["srcHeight"])/2;
		if(bgObj["srcHeight"] > bgImage.height) {
			bgObj["srcWidth"] = bgImage.height/aspectRatio;
			bgObj["srcHeight"] = bgImage.height;
			bgObj["srcX"] = (bgImage.width - bgObj["srcWidth"])/2;
			bgObj["srcY"] = 0;
		}
		//redraw();
	}
}

function saveImage() {
	var saveCanvas = document.createElement("canvas");
	saveCanvas.id = "toSave";
	var saveContext = saveCanvas.getContext("2d");
	saveCanvas.width = width;
	saveCanvas.height = height;

	saveContext.fillStyle = bgColor;
	saveContext.fillRect(0,0,saveCanvas.width, saveCanvas.height);
	if(!bgIsColor) {
		if(Object.keys(bgObj).length > 0) {
			saveContext.drawImage(bgImage,
				bgObj["srcX"], bgObj["srcY"], bgObj["srcWidth"], bgObj["srcHeight"],
				0,0,saveCanvas.width, saveCanvas.height);
		}
	}
	saveContext.drawImage(canvas,0,0);
	return saveCanvas.toDataURL();
}
