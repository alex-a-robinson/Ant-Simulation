/**
* Collection of tools which aid simulation
*/ 

function randInt(min, max) {
	// Returns a random integer in the range(min, max)
	// -+- Not truely random
	return Math.floor(Math.random() * (max - min + 1) + min);
}

// Returns a random direction excluding no direction
function randDir() {
	var dirs = [DIR.north, DIR.east, DIR.south, DIR.west];
	return dirs[randInt(0, 3)]
}

function reverseDir(dir) {
	return -1 * dir;
}

// Picks a random property of a object literal
// http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
function randProperty(obj) {
	var result;
	var count = 0;
	for (var prop in obj)
		if (Math.random() < 1/++count)
			result = prop;
	return result
}

// Normalize a list of items
function normalize(items) {
	var max = 0;
	
	for (var i = 0; i < items.length; i++)
		if (items[i] > max) max = items[i]; 

	for (var i = 0; i < items.length; i++)
		items[i] = items[i] / max;
	
	return items;
}

/*
function log(obj) {
	// Shorthand to console.log objects, strings, ...
	console.log(obj);
}*/

function getDOM(id) {
	// Returns the Document Object Model of an element with the id
	return document.getElementById(id);
}

// UPDATE FOR TOURUS AS distance will wrap around map 				<------------------ is this the real distance?
function calcDist(coord1, coord2) {
	// Returns the absolute distance between two coordinates
	var distX = Math.min(Math.abs(coord1.x - coord2.x), GRID_SIZE.x - Math.abs(coord1.x - coord2.x));
	var distY = Math.min(Math.abs(coord1.y - coord2.y), GRID_SIZE.y - Math.abs(coord1.y - coord2.y));
	return distX + distY;
}

// Calculates the effort required to get a item of a certain value at a certain distance
function calcEffort(coord1, coord2, value) {
	var distance = calcDist(coord1, coord2);
	return distance/value;
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


// Returns the direction to take to get from coord to target
function pathTo(coord, target) {

	if (coord.x === target.x && coord.y === target.y)	// already at target
		return DIR.none
		
	// Determin if it the distance going over the wraped edge is shorter
	var wrapedX = (Math.abs(coord.x - target.x) >= GRID_SIZE.x / 2)?true:false;
	var wrapedY = (Math.abs(coord.y - target.y) >= GRID_SIZE.y / 2)?true:false;
	
	// Find angle between horizontal and target
	var b = Math.abs(coord.x - target.x);
	var c = Math.abs(coord.y - target.y);
	var a = Math.sqrt(b^2 + c^2);	// pythagrous
	
	var theta = Math.acos((a^2 + b^2 - c^2) / (2 * a * b)); // cosine rule
	
	if (b === 0)
		theta = 3.14;
	if (c === 0)
		theta = 0;
	
	// Determin quadrant
	if (coord.x < target.x) {
		if (coord.y < target.y)	// 4th quadrant
			return (theta < 3.14/2 && theta >= 0)?((!wrapedX)?DIR.east:DIR.west):((!wrapedY)?DIR.south:DIR.north);
		else	// 1st quadrant
			return (theta < 3.14/2 && theta >= 0)?((!wrapedX)?DIR.east:DIR.west):((!wrapedY)?DIR.north:DIR.south);
	} else {
		if (coord.y < target.y) // 3rd quadrant
			return (theta < 3.14/2 && theta >= 0)?((!wrapedX)?DIR.west:DIR.east):((!wrapedY)?DIR.south:DIR.north);
		else	// 2nd quadrant
			return (theta < 3.14/2 && theta >= 0)?((!wrapedX)?DIR.west:DIR.east):((!wrapedY)?DIR.north:DIR.south);
	}
	
	/***
	* Old distance choosing 
	***
	// Check if the coordinate is on the other side of the plane i.e. the distance between the particles
	// is > half of the distance (squaring is done to get positive value)

	var wrapedX = (Math.abs(coord1.x - coord2.x) >= GRID_SIZE.x / 2)?true:false;
	var wrapedY = (Math.abs(coord1.y - coord2.y) >= GRID_SIZE.y / 2)?true:false;
	
	// To give rise to diaginal paths .5 probability of move along x-axis vs y-axis
	var xPriority = (Math.random() < 0.5)?true:false;
	
	if (xPriority && coord1.x !== coord2.x) return ((coord1.x < coord2.x))?((wrapedX)?DIR.west:DIR.east):((wrapedX)?DIR.east:DIR.west);
	else if (coord1.y !== coord2.y) return ((coord1.y < coord2.y))?((wrapedY)?DIR.north:DIR.south):((wrapedY)?DIR.south:DIR.north);
	else if (coord1.x !== coord2.x) return ((coord1.x < coord2.x))?((wrapedX)?DIR.west:DIR.east):((wrapedX)?DIR.east:DIR.west);
	else return 0;
	*/
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

// Returns a list of coordinates around (a distance dist) a point <-- SHOULD BE A CIRCLE NOT SQUARE
function getBlock(coord, dist) {
	var block = [];
	
	for (var y = (coord.y - dist); y < (coord.y + dist + 1); y++) {	// Extra 1 is need as list is inclusive
		for (var x = (coord.x - dist); x < (coord.x + dist + 1); x++) {
			
			var searchCoord = {
				x : x,
				y : y
			};
			block.push(boundary(searchCoord, MAP_BOUNDARY));
		}
	}
	
	return block;
}

// Need generlised solution look at https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
// Includes the cell being stood on
function getSegment(coord, dist, dir) {
	
	var cells = [];
	
	if (dir === DIR.north || dir === DIR.south) {
	
		var rowStop = 1;
		var rowStart = 0;
	
		var dirction = (dir === DIR.north)?-1:1;
		
		for (var y = 0; y < dist; y++) {
			for (var x = rowStart; x < rowStop; x++) {
				cells.push(boundary({x : coord.x + x, y : coord.y + y * dirction}, MAP_BOUNDARY));
			}
			rowStop += 1;
			rowStart -= 1;
		}
		
	} else {
	
		var colStop = 1;
		var colStart = 0;
	
		var dirction = (dir === DIR.east)?1:-1;
		
		for (var x = 0; x < dist; x++) {
			for (var y = colStart; y < colStop; y++) {
				cells.push(boundary({x : coord.x + x * dirction, y : coord.y + y}, MAP_BOUNDARY));
			}
			colStop += 1;
			colStart -= 1;
		}
	}
	
	for (var i = 0; i < cells.length; i++) {
		var s = new show(cells[i], genID());
		s.addToMap();
	}
	
	return cells;
}

function colourSaturation(baseColours, sat) {
	sat = Math.round(sat * 10) / 10;
												// rounding (x * 10) / 10 is to get rounded number to 1dp
	if (baseColours.length === 5) {
		switch (true) {
			case (sat <= 0.2):
				return baseColours[4];
				break;
			case (sat <= 0.4):
				return baseColours[3];
				break;
			case (sat <= 0.6):
				return baseColours[2];
				break;
			case (sat <= 0.8):
				return baseColours[1];
				break;
			case (sat <= 1):
				return baseColours[0];
				break;
			default:
				console.log('Error: colourSaturation(): saturation not in range.');
		}
	} else {
		console.log('Error: colourSaturation(): Not 5 colours in baseColours.');
	}
}

// Calculates lighter or darker hex colours
// http://www.sitepoint.com/javascript-generate-lighter-darker-color/
function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

// Creates a new ant object
function createAnt(species, coord) {
	var ant = new Ant(-1, coord);
	species.addAnt(ant);
	antsList.push(ant);
	ant.id = antsList.length - 1;		// <--- This will mess up once ants start getting deleted from the array as all of the indexs will be changed
	console.log('new ant id: ' + ant.id);
	ant.addToMap();
}

function genID() {
	CURRENT_ID += 1;
	return CURRENT_ID
}