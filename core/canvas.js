/**
* Functions responsible for controlling the canvas
*/

function getCTX(canvasDOM) {
	// Get canvas context
	return canvasDOM.getContext('2d');
}

function resizeElement(DOM, size) {
	// Resize the canvas to specific width and height
	DOM.width = size.width;
	DOM.height = size.height;
}

function drawRect(ctx, coord, size, fillColour, strokeColour, lineWidth) {
	// Draw a rectangle
	if (typeof strokeColour === 'undefined') strokeColour = '#000000';
	if (typeof lineWidth === 'undefined') lineWidth = 0;
	
	ctx.fillStyle = fillColour;
	ctx.fillRect(coord.x, coord.y, size.width, size.height);
	
	if (lineWidth > 0) {
		ctx.strokeStyle = strokeColour;
		ctx.lineWidth = lineWidth;
		ctx.stroke();
	}
}

function drawLine(ctx, coord1, coord2, strokeColour, lineWidth) {
	// Drawing straight lines only

	if (lineWidth > 0) {
		ctx.strokeStyle = strokeColour;
		ctx.lineWidth = lineWidth;
		ctx.beginPath();
		ctx.moveTo(coord1.x, coord1.y);
		ctx.lineTo(coord2.x, coord2.y);
		ctx.closePath();
		ctx.stroke();
	}
}

function drawArc(ctx, coord, radius, startAngle, endAngle, strokeColour, lineWidth) {
	if (lineWidth > 0) {
		ctx.strokeStyle = strokeColour;
		ctx.lineWidth = lineWidth;
		ctx.beginPath();
		ctx.arc(coord.x, coord.y, radius, startAngle, endAngle, false);
		ctx.closePath();
		ctx.stroke();
	}
}

// Shortcut function to clear the entire canvas
function clearCanvas(ctx) {
	drawRect(ctx, {x : 0, y : 0}, {width : CANVAS.width, height : CANVAS.height}, BACKGROUND_COLOUR);
}