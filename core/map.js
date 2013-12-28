function drawGrid(ctx) {
	for (var x = 0; x < GRID_SIZE.x + 1; x += 1)
		drawLine(ctx, {x : x * CELL_SIZE.width  + START_COORD.x, y : START_COORD.y}, {x : x * CELL_SIZE.width + START_COORD.x, y : GRID_SIZE.y * CELL_SIZE.height + START_COORD.y}, GRID_COLOUR, GRID_LINE_WIDTH);
		
	for (var y = 0; y < GRID_SIZE.y + 1; y += 1)
		drawLine(ctx, {x : START_COORD.x, y : y * CELL_SIZE.height + START_COORD.y}, {x : CELL_SIZE.height * GRID_SIZE.y  + START_COORD.x, y : y * CELL_SIZE.height + START_COORD.y}, GRID_COLOUR, GRID_LINE_WIDTH);
}

function drawBackground(ctx) {
	drawRect(ctx, {x : 0, y : 0}, {width : 500, height : 500}, BACKGROUND_COLOUR);
}

function zoom(amount) {
	CELL_SIZE.width += amount;
	CELL_SIZE.height += amount;
}

function createMap() {
	for (var i = 0; i < NUM_OF_CELLS; i++)
		MAP[i] = {ant : [], food : void(0), pheromone : []};
}