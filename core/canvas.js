/**
 * Resizes an HTML element to a specific size
 * @param {HTML element} element - The element to be resized
 * @param {width : number, height : number} size - The new size of the element
 */
function resizeElement(element, size) {
    element.width = size.width;
    element.height = size.height;
}
/**
 * Draws a rectangle onto a canvas context
 * @param {canvas context 2d} ctx - The context which the rectangle will be drawn onto
 * @param {x : number, y : number} coord - The coordinate of the top left corner
 * @param {width : number, height : number} size - The size of the rectangle
 * @param {string} fillColour - The colour of the rectangle
 * @param {string} strokeColour - The stroke colour of the rectangle 
 * (defaults to '#000000')
 * @param {number} lineWidth - The width of the border (defaults to 0)
 */
function drawRect(ctx, coord, size, fillColour, strokeColour, lineWidth) {
    if (typeof strokeColour === 'undefined') strokeColour = '#000000';
    if (typeof lineWidth === 'undefined') lineWidth = 0;
    ctx.fillStyle = fillColour;
    ctx.fillRect(coord.x, coord.y, size.width, size.height);
    // Only boarder if width is > 0
    if (lineWidth > 0) {
        ctx.strokeStyle = strokeColour;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }
}
/**
 * Draws a line onto a canvas context
 * @param {canvas context 2d} ctx - The context which the line will be drawn onto
 * @param {x : number, y : number} coord1 - The coordinate of the starting point
 * @param {x : number, y : number} coord2 - The coordinate of the ending point
 * @param {string} strokeColour - The stroke colour of the line
 * @param {number} lineWidth - The width of the stroke
 */
function drawLine(ctx, coord1, coord2, strokeColour, lineWidth) {
    // Drawing straight lines only
    // Only boarder if width is > 0
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
/**
 * Draws an arc onto a canvas context
 * @param {canvas context 2d} ctx - The context which the arc will be drawn onto
 * @param {x : number, y : number} coord - The coordinate of the centre of the arc
 * @param {number} radius - The radius of the arc
 * @param {number} startAngle - The angle from the horizontal to start the arc at
 * @param {number} endAngle - The angle from the horizontal to stop the arc at
 * @param {string} strokeColour - The stroke colour of the arc
 * @param {number} lineWidth - The width of the stroke
 * @param {string} fillColour - The colour of the arc
 */
function drawArc(ctx, coord, radius, startAngle, endAngle, strokeColour,
                    lineWidth, fillColour) {
    if (lineWidth > 0) {
        ctx.beginPath();
        ctx.arc(coord.x, coord.y, radius, startAngle, endAngle, false);
        ctx.closePath();
        if (typeof strokeColour !== 'unefined') {
            ctx.strokeStyle = strokeColour;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }
        if (typeof fillColour !== 'unefined') {
            ctx.fillStyle = fillColour;
            ctx.fill();
        }
    }
}
/**
 * Draws a circle
 * @param {canvas context 2d} ctx - The context which the arc will be drawn onto
 * @param {x : number, y : number} coord - The coordinate of the centre of the arc
 * @param {number} radius - The radius of the arc
 * @param {string} fillColour - The colour of the arc
 */
function drawCircle(ctx, coord, radius, fillColour) {
    ctx.beginPath();
    ctx.arc(coord.x, coord.y, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = fillColour;
    ctx.fill();
}
/**
 * Draws an arc onto a canvas context
 * @param {canvas context 2d} ctx - The context which the arc will be drawn onto
 * @param {x : number, y : number} coord - The coordinate of the centre of the arc
 * @param {number} radius - The radius of the arc
 * @param {number} startAngle - The angle from the horizontal to start the arc at
 * @param {number} endAngle - The angle from the horizontal to stop the arc at
 * @param {string} strokeColour - The stroke colour of the arc
 * @param {number} lineWidth - The width of the stroke
 */
function drawArc(ctx, coord, radius, startAngle, endAngle, strokeColour,
                    lineWidth, fillColour) {
    if (lineWidth > 0) {
        ctx.strokeStyle = strokeColour;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(coord.x, coord.y, radius, startAngle, endAngle, false);
        ctx.closePath();
        ctx.stroke();
    }
}
/**
 * Draws a rectangle over the entire canvas effectively wiping it to a single colour
 * @param {canvas context 2d} ctx - The context which the rectangle will be drawn onto
 */
function clearCanvas(ctx) {
    drawRect(ctx, {
        x: 0,
        y: 0
    }, CANVAS, OUT_OF_BOUNDS_COLOUR);
}