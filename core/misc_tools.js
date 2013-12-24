function randInt(range) {
	// Returns a random integer in the range(min, max)
	// -+- Not truely random
	return Math.floor(Math.random() * (range.max - range.min + 1) + range.min);
}

// http://stackoverflow.com/questions/9724404/random-floating-point-double-in-inclusive-range
function randFloat(range) {
	  return Math.random() < 0.5 ? ((1-Math.random()) * (range.max - range.min) + range.min) : (Math.random() * (range.max - range.min) + range.min);
}

// Returns a random direction
function randDir() {
	var dir = Math.random() * Math.PI * 2;
	return dir;
}

// Reverses the ants dirction i.e. turns it 180 degres
function reverseDir(dir) {
	return dir + Math.PI;
}

// Returns a direction in the range 0 to 2 * PI
function validateDirection(dir) {
	var newDir = dir;
	while (newDir >= Math.PI * 2) {	// if over the range
		newDir -= Math.PI * 2;
	}
	
	while (newDir < 0) {				// if under the range	
		newDir += Math.PI * 2;
	}
	
	return newDir;
}

// Picks a random property of a object literal
// http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
function randProperty(obj) {
	var result;
	var count = 0;
	for (var prop in obj)
		if (Math.random() < 1/++count)
			result = prop;
	return result;
}

function getDOM(id) {
	// Returns the Document Object Model of an element with the id
	return document.getElementById(id);
}

function distance(coord1, coord2) {
	var x = coord1.x - coord2.x;
	var y = coord1.y - coord2.y;
	return Math.sqrt(x*x + y*y);
}

// Calculates the effort required to get a item of a certain value at a certain distance
function calcEffort(coord1, coord2, value) {
	var dist = distance(coord1, coord2);
	return dist/value;
}

function coordToIndex(coord) {
	// Translates (x, y) coordinate to linear position in map
	return coord.x + coord.y * GRID_SIZE.x;
}

function indexToCoord(index) {
	// Translates linear position in map to (x, y) coordinates on grid
	var x = index - Math.floor(index / GRID_SIZE.x) * GRID_SIZE.x;
	var y = Math.floor(index / GRID_SIZE.x);
	return {x:x, y:y};
}

function scaleCoord(coord) {
	// Takes a coord between [0, GRID_SIZE_X] and [0, GRID_SIZE_Y] and translates to acutal position on canvas i.e. with CELL_SIZE_X
	return {x : coord.x * CELL_SIZE.width, y : coord.y * CELL_SIZE.height};
}

// Returns the cell index which most closely contains the coord
function getCellIndex(coord) {
	var cellCoord = boundary({x: Math.round(coord.x), y: Math.round(coord.y)}, MAP_BOUNDARY);
	return coordToIndex(cellCoord);
}

function getCellCoord(coord) {
	return boundary({x: Math.round(coord.x), y: Math.round(coord.y)}, MAP_BOUNDARY);
}

// Returns the warped coordinate if exceeds a boundary
function boundary(coord, bounds) {

	// Check x bounds
	if (coord.x < bounds.x.min) coord.x = bounds.x.max - Math.abs(coord.x);	// x may be negative if x < 0
	else if (coord.x >= bounds.x.max) coord.x = coord.x - bounds.x.max;		// x cannot be negative unless boundry is
	
	// Check y bounds
	if (coord.y < bounds.y.min) coord.y = bounds.y.max - Math.abs(coord.y);
	else if (coord.y >= bounds.y.max) coord.y = coord.y - bounds.y.max;

	return coord;
}

function getBlock(coord, size) {
	block = [];

	for (var y = coord.y - size.height; y <= coord.y + size.height; y++) {	// Extra 1 is need as list is inclusive
		for (var x = coord.x - size.width; x <= coord.x + size.width; x++) {
			block.push(getCellCoord({x : x, y : y}));
		}
	}
	
	return block;
}

function getSector(coord, radius, direction, angle) {

	var block = [];

	for (var y = coord.y - radius; y <= coord.y + radius; y++) {	// Extra 1 is need as list is inclusive
		for (var x = coord.x - radius; x <= coord.x + radius; x++) {
			
			var searchCoord = {
				x : x,
				y : y
			};		
					
			if (validateDirection(angleTo(coord, searchCoord)) >= validateDirection(direction - angle/2) && validateDirection(angleTo(coord, searchCoord)) <= validateDirection(direction + angle/2) && distance(coord, searchCoord) <= radius) {
				block.push(getCellCoord(searchCoord));
			} else if ((validateDirection(direction) <= angle/2 || validateDirection(direction) >= Math.PI*2 - angle/2) && (validateDirection(angleTo(coord, searchCoord)) <= validateDirection(direction + angle/2) || validateDirection(angleTo(coord, searchCoord)) >= validateDirection(direction - angle/2)) && distance(coord, searchCoord) <= radius){
				block.push(getCellCoord(searchCoord));
			}
		}
	}

	return block;
}

function turnAround(angle) {
	return angle + Math.PI;
}

function byValue(varible) {
	var safe = varible;
	return safe;
}

function angleTo(coord, target) {
	var dx = target.x - coord.x;
	var dy = target.y - coord.y;
	
	return Math.atan2(dy, dx) + Math.PI/2;	// atan2 find the angle from the horizontal however we use from the vertical
}

// Creates a new ant object
function createAnt(species, coord, nest, startingHealth, type) {
	
	var antCoord = coord;

	switch (type) {
		case ANT_TYPE.worker:
			var ant = new Worker(genID(), antCoord);
			ant.colour = species.colour.worker;
			break;
		
		case ANT_TYPE.queen:
			var ant = new Queen(genID(), antCoord);
			ant.colour = species.colour.queen;
			break;
			
		case ANT_TYPE.soldier:
			var ant = new Worker(genID(), antCoord);		// <-- should be soldier
			ant.colour = species.colour.soldier;
			break;
	}
	
	ant.species = species;
	ant.nest = nest;
	ant.health = startingHealth;
	
	antsList.push(ant);
	ant.addToMap();
}

function genID() {
	CURRENT_ID += 1;
	return CURRENT_ID
}