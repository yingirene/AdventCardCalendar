var xRatio = 3;
var yRatio = 2;
var scale = 900;
var width = scale;
var height = (scale/xRatio) * yRatio;
var isLandscape = true;

var mainCard

window.onload = function() {
	console.log("It begins.");
	var canvas = document.getElementById("mainCanvas");
	var context = canvas.getContext("2d");
	context.canvas.width = window.innerWidth;
	context.canvas.height = window.innerHeight;

	if(isLandscape) {
		mainCard = new Card(width, height);
	} else {
		mainCard = new Card(height, width);
	}
};

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
