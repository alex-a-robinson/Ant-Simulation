// Draws a onto the canvas
function drawGrid(ctx) {
	for (var x = 0; x < GRID_SIZE.width + 1; x += 1)	// Draw lines parallel to the x-axis 
		drawLine(ctx, {x : x * CELL_SIZE.width  + START_COORD.x, y : START_COORD.y}, {x : x * CELL_SIZE.width + START_COORD.x, y : GRID_SIZE.height * CELL_SIZE.height + START_COORD.y}, GRID_COLOUR, GRID_LINE_WIDTH);
		
	for (var y = 0; y < GRID_SIZE.height + 1; y += 1)	// Draw lines parallel to the y-axis 
		drawLine(ctx, {x : START_COORD.x, y : y * CELL_SIZE.height + START_COORD.y}, {x : CELL_SIZE.height * GRID_SIZE.height  + START_COORD.x, y : y * CELL_SIZE.height + START_COORD.y}, GRID_COLOUR, GRID_LINE_WIDTH);
}

// Draws a solid rectangle the size of the canvas
function drawBackground(ctx) {
	drawRect(ctx, {x : 0, y : 0}, CANVAS, BACKGROUND_COLOUR);
}

// Changes the zoom amount (positive : zoom in, negative : zoom out)
function zoom(amount) {
	CELL_SIZE.width += amount;
	CELL_SIZE.height += amount;
}

// Create an empty map
function createMap() {
	for (var i = 0; i < NUM_OF_CELLS; i++)
		MAP[i] = {ant : [], food : void(0), pheromone : []};
}