/**
*Todo:
* Perhaps implement a memory of the 5 least effort foods around an ant?  even if it is out of sight

* Watch for functions which pass by reference e.g. when using this.variable

*	- Add support for IE (version the school uses)
*	- Create ant subclasses
*		+ solider
*			- functions:
*				+ attack
*				+ patrol
*			- properties:
*				+ damage rate
*	- Create map class
*		+ environments

	Need regenerating food
	Need better looking food
	
*/

// Define file scope varibles
var canvasDOM;
var canvasCTX;

// What is done each tick
function tick() {
	var ST = new Date;
	
	drawMap(canvasCTX);
	
	//  Framerate system
	var ET = new Date;
	if (ET - ST > 0) {		// so not to console.log infinity if too high
		var fps = 1000 / (ET - ST);
		//console.log('FPS: ' + fps.toFixed(1));
	}
	
	updateSpeciesData();
	setTimeout(tick, TICK_TIME);
}

// Draw all objects
function drawMap(ctx) {
	if (RUNNING) {
		clearCanvas(canvasCTX);
		drawBackground(canvasCTX)
		
		// Update all of the ants in the sytem
		for (var i = 0; i < ANTS_LIST.length; i++)
			ANTS_LIST[i].update();
		
		// Update each cell on the map
		for (var i = 0; i < NUM_OF_CELLS; i++) {		
			var coord = indexToCoord(i);
			if (visible(coord)) {
				
				// Update and draw the pheromones in the cell
				for (var k = 0; k < MAP[i].pheromone.length; k++) {
					var pheromone = MAP[i].pheromone[k];
					pheromone.update();
					pheromone.draw(ctx);
				}
				
				// Draw all the ants in a cell [This can be reduced to only drawing the top ant as the others are hidden]
				if (MAP[i].ant.length > 0) {
					for (var k = 0; k < MAP[i].ant.length; k++) {
						var ant = MAP[i].ant[k];
						ant.draw(ctx);
					}
				} else if (MAP[i].food !== void(0)) {		// Don't want to draw food ontop of ants
					var food = MAP[i].food;
					food.draw(ctx);
				}
			}
		}
		drawGrid(canvasCTX);
	}
}

// Setups the enviroment when starting or restarting the simulation
function createEnviroment() {
	
	CURRENT_ID = 0;
	SPECIES_LIST = [];
	ANTS_LIST = [];
	RUNNING = true;
	
	// Remove previouse data about old species
	var speciesClass = document.getElementsByClassName('species');
	for (var i = 0; i < speciesClass.length; i++) {
		var DOM = speciesClass[i];
		DOM.parentElement.removeChild(DOM);
	}
	
	// Create empty map
	createMap();
	
	// Create food system & add food
	FOOD = new FoodSystem();
	
	/*FOOD.addRandFood({x: 40, y: 40}, 5);
	FOOD.addRandFood({x: 40, y: 10}, 4);
	FOOD.addRandFood({x: 15, y: 40}, 2);
	FOOD.addRandFood({x: 10, y: 20}, 3);
	
	FOOD.addRandFood({x: 80, y: 60}, 10);
	FOOD.addRandFood({x: 20, y: 75}, 15);
	FOOD.addRandFood({x: 45, y: 90}, 6);
	FOOD.addRandFood({x: 70, y: 70}, 8);
	FOOD.addRandFood({x: 5, y: 80}, 5);
	FOOD.addRandFood({x: 5, y: 80}, 5);
	FOOD.addRandFood({x: 25, y: 40}, 10);*/
	FOOD.addFood();
	
	// Create the users species
	USER_SPECIES = new Species(genID());
	USER_SPECIES.colour = {
		worker : '#1C1C1C',
		soldier : '#1C1C1C',
		queen : '#00FF00',
		nest : '#555555',
		pheromone : '#E8E5A3',
	};	
	
	SELECTED_SPECIES = USER_SPECIES;
	
	SPECIES_LIST.push(USER_SPECIES);
	createSpeciesData(USER_SPECIES);
	updateUserSpecies();
	
	// Add some starting queen ants
	for (var i = 0; i < STARTING_QUEEN_ANT_NUMBER; i++) {
		var x = randInt({min : 0, max : GRID_SIZE.width - 1});	// -1 as randInt is inclusive
		var y = randInt({min : 0, max : GRID_SIZE.height - 1});
		var a = new Queen(genID(), {x : x, y : y});
		a.addToMap();
		a.species = USER_SPECIES;
		a.colour = USER_SPECIES.colour.worker;
		ANTS_LIST.push(a);
		a.sayHello();
	}
}

// Obj holding the functions each button performs
var BUTTONS = {	
	reset : updateDefaultValues,
	random : updateRandomValues,
	run : runPauseButton,
	update : updateUserSpecies,
	step : step,
	restart : createEnviroment
};

// Once the HTML is loaded
window.onload = function() {

	// Get canvas DOM & canvas context
	canvasDOM = getElement(CANVAS.name);
	canvasCTX = canvasDOM.getContext('2d');
	
	resizeElement(canvasDOM, CANVAS);
	
	// Add event listeners for keypress
	window.onkeydown = function(e) {
		e = e || window.event;
		var charCode = e.keyCode || e.which;
		switch (charCode) {
			case LEFT_ARROW_KEY:
				START_COORD.x += PAN_AMOUNT;
				break;
			case RIGHT_ARROW_KEY:
				START_COORD.x -= PAN_AMOUNT;
				break;
			case UP_ARROW_KEY:
				START_COORD.y += PAN_AMOUNT;
				break;
			case DOWN_ARROW_KEY:
				START_COORD.y -= PAN_AMOUNT;
				break;
			case PLUS_KEY:
				zoom(ZOOM_AMOUNT)
				break;
			case MINUS_KEY:
				zoom(-1 *ZOOM_AMOUNT)
				break;
		}
	};
	
	createEnviroment();
	
	// Set the sliders to their defualt values
	createCharacteristicInputs();
	
	tick();
};