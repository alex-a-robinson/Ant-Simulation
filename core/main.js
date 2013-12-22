/**
*Todo:
*	Change food Density to amount and start using food pecies and use objects instead of ids

* Pherhapes implament a memory of the 5 least effort foods arond an ant?  even if it is out of sight

* What if target moves/gets eaten while on way to target?  i.e. check target is still where it should be each tick

* Watch for functions which pass by referance e.g. when using this.varible

*	- Add dynamic canvas resizing
*	- Add support for IE (version the school uses)
*	- Create ant class
*		+ functions:
*			- move
*			- draw
*			- depositePheromones
*			- findFood
*		+ properties:
*			- ## DETERMINED ##
*			- species (determines colour)
*			- position
*			- direction
*			- speed
*			- colour
*			- health
*			- hunger
*			- hunger rate
*			- pheromone concentration
*			- goal
*			- view distance (eyesight)
*			
*			- ## CHARACTERISTICS ##
*			- exoskeleton: increases health; decreases speed, increases hunger rate
*			- pincer size: increase damage rate; decreases speed, increases hunger rate
*			- pincer strength: increases food carry amount; increases hunger rate
*			- (?) aggression: determines how likely an ant is to attack
*			- exploitative: determines how likely an ant is to not follow a trial
*			- eyesight: increase view distance; increases hunger rate
*			- pheromone concentration: increase max pheromone concentration; increase hunger rate
*	- Create ant subclasses
*		+ worker
*			- functions:
*				+ collectFood
*				+ depositeFood
*			- properties:
*				+ carrying
*				+ carry amount
*		+ solider
*			- functions:
*				+ attack
*				+ patrol
*			- properties:
*				+ damage rate
*		+ queen
*			- functions:
*				+ reproduce
*				+ mutate
*				+ create nest
*			- properties:
*				+ worker ant reproduction percent
*				+ solider ant reproduction percent
*				+ queen ant reproduction percent
*				+ mutation rate
*	- Create map class
*		+ 2 levels of zoom
*		+ gird system
*		+ grid flags e.g. ant (inc type), pheromone, nest
*		+ environments
*		+ pheromone evaporation
*/

// File scope variables
var canvasDOM;
var canvasCTX;

// Represents what happens each tick
function tick() {
	console.log('--------- TICK ----------');
	var ST = new Date;
		
	clearCanvas(canvasCTX);
	
	// Update all of the species
	for (var i = 0; i < antsList.length; i++)
		antsList[i].update();
	
	drawMap(canvasCTX);
	
	drawGrid(canvasCTX);
	
	var ET = new Date;
	/*if (ET - ST > 0) {		// so not to console.log infinity if too high
		var fps = 1000 / (ET - ST);
		console.log('FPS: ' + fps.toFixed(1));
	}*/
	setTimeout(tick, TICK_TIME);
}

// All drawing is done in a batch to improve performance [check this]
function drawMap(ctx) {
	for (var i = 0; i < NUM_OF_CELLS; i++) {		
		// Update pheromone concentrations (better place to put this is in a function)
		// However this loop is already running so for performance putting it in here

		for (var k = 0; k < MAP[i].pheromone.length; k++) {
			var pheromone = MAP[i].pheromone[k];
			pheromone.update();
			pheromone.draw(ctx);
		}
		if (MAP[i].ant.length > 0) {		// Don't need to draw all of the ants if they are on top of each other!
			var ant = MAP[i].ant[0];		// Only draw top ant
			ant.draw(ctx);
			
			//drawRect(ctx, scaleCoord(ant.coord), ant.size, ant.species.colour.ant);
			//var ant = antsList[MAP[i].ant[0]];	// only drawing the first ant in the list
			//console.log(ant);
			//drawRect(ctx, scaleCoord(indexToCoord(i)), ant.size, ant.species.colour.ant);
		} else if (MAP[i].food !== void(0)) {
			var food = MAP[i].food;
			drawRect(FOOD.ctx, scaleCoord(indexToCoord(i)), CELL_SIZE, FOOD.colours[food.amount]);
		}
	}
}

window.onload = function() {

	// Get canvas DOM then canvas context
	canvasDOM = getDOM(CANVAS.name);
	canvasCTX = getCTX(canvasDOM);
	
	// Create empty map
	createMap();
	
	// Create food system
	FOOD = new FoodSystem(DEBUG_AMOUNT_OF_FOOD);
	FOOD.ctx = canvasCTX;
	FOOD.addRandFood({x: 140, y: 140}, 35);
	
	// Create a species
	var testSpecies = new Species(genID());
	speciesList.push(testSpecies);
	testSpecies.chars.speed = 1;
	testSpecies.chars.eyesight = 3;
	testSpecies.chars.eyeAngle = Math.PI;	// only seems to work for pi i.e. 180 degs
	testSpecies.chars.pheromoneConcentration = 0.4;
	testSpecies.chars.antennaSize = 1;
	testSpecies.colour = {
		ant : '#222222',
		pheromone : '#E8E5A3',
		nest : '#555555'
	};	
	
	
	var coord = {x: 25, y: 25};
	
	var nest = new Nest(genID(), coord);
	nest.species = testSpecies;
	
	antsList.push(nest);
	
	// Add some basic peices, this could break if coord is off map e.g. on edge, need more reduntent way of doing this
	nest.addNestPiece(coord);
	nest.addNestPiece({x : coord.x - 1, y : coord.y});
	nest.addNestPiece({x : coord.x, y : coord.y - 1});
	
	nest.addNestPiece({x : coord.x - 1, y : coord.y - 1});
	nest.addNestPiece({x : coord.x + 1, y : coord.y});
	nest.addNestPiece({x : coord.x + 1, y : coord.y - 1});
	
	nest.addNestPiece({x : coord.x, y : coord.y + 1});
	nest.addNestPiece({x : coord.x - 1, y : coord.y + 1});
	nest.addNestPiece({x : coord.x + 1, y : coord.y + 1});
	
	// Add Queen
	/*var x = randInt(0, GRID_SIZE.x - 1);	// -1 as randInt is inclusive
	var y = randInt(0, GRID_SIZE.y - 1);
	var test = new Queen(0, {x : x, y : y});
	testSpecies.addAnt(test);
	antsList.push(test);			// <--- Not drawing wraping around the screen
	test.addToMap();*/
	
	// Add ants
	for (var i = 0; i < DEBUG_ANT_NUM; i++) {
		var x = randInt(0, GRID_SIZE.x - 1);	// -1 as randInt is inclusive
		var y = randInt(0, GRID_SIZE.y - 1);
		var a = new Worker(genID(), {x : x, y : y});
		a.addToMap();
		a.species = testSpecies;
		antsList.push(a);
		a.nest = nest;
		a.sayHello();
	}
	
	tick();
};