/**
* Draws a grid onto the canvas context
* @param {canvas context 2d} ctx - The context which the grid will be drawn onto
*/
function drawGrid(ctx) {
	for (var x = 0; x < GRID_SIZE.width + 1; x += 1)	// Draw lines parallel to the x-axis 
		drawLine(ctx, {x : x * CELL_SIZE.width  + START_COORD.x, y : START_COORD.y}, {x : x * CELL_SIZE.width + START_COORD.x, y : GRID_SIZE.height * CELL_SIZE.height + START_COORD.y}, GRID_COLOUR, GRID_LINE_WIDTH);
		
	for (var y = 0; y < GRID_SIZE.height + 1; y += 1)	// Draw lines parallel to the y-axis 
		drawLine(ctx, {x : START_COORD.x, y : y * CELL_SIZE.height + START_COORD.y}, {x : CELL_SIZE.height * GRID_SIZE.height  + START_COORD.x, y : y * CELL_SIZE.height + START_COORD.y}, GRID_COLOUR, GRID_LINE_WIDTH);
}

/**
* Draws a rectangle over the entire canvas effectively wiping it to a single colour
* @param {canvas context 2d} ctx - The context which the rectangle will be drawn onto
*/
function drawBackground(ctx) {
	drawRect(ctx, START_COORD, {width : GRID_SIZE.width * CELL_SIZE.width, height : GRID_SIZE.height * CELL_SIZE.height}, BACKGROUND_COLOUR);
}

/**
* Change simulation zoom level
* @param {number} level - The zoom level (positive : zoom in, negative : zoom out)
*/
function zoom(level) {
	if (CELL_SIZE.width + level > MIN_ZOOM && CELL_SIZE.width + level < MAX_ZOOM && CELL_SIZE.height + level > MIN_ZOOM && CELL_SIZE.height + level < MAX_ZOOM) {
		CELL_SIZE.width += level;
		CELL_SIZE.height += level;
	}
	console.log(CELL_SIZE.width + ':' + CELL_SIZE.height);
}

/**
* Create an empty map and populate it with default values
*/
function createMap() {
	for (var i = 0; i < NUM_OF_CELLS; i++)
		MAP[i] = {ant : [], food : void(0), pheromone : []};
}