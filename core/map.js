/**
* Functions responsible for creating and updating the map
*/

function drawGrid(ctx) {
	for (var x = 0; x < GRID_SIZE.x + 1; x += 1)
		drawLine(ctx, {x : x * CELL_SIZE.width, y : 0}, {x : x * CELL_SIZE.width, y : GRID_SIZE.y * CELL_SIZE.height}, GRID_COLOUR, GRID_LINE_WIDTH);
		
	for (var y = 0; y < GRID_SIZE.y + 1; y += 1)
		drawLine(ctx, {x : 0, y : y * CELL_SIZE.height}, {x : CELL_SIZE.height * GRID_SIZE.y, y : y * CELL_SIZE.height}, GRID_COLOUR, GRID_LINE_WIDTH);
}

function createMap() {
	for (var i = 0; i < NUM_OF_CELLS; i++)
		MAP[i] = {ant : [], food : void(0), pheromone : []};
}