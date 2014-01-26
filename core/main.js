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

// Define file scope variables
var canvasDOM;
var canvasCTX;

// What is done each tick
function tick() {
	drawMap(canvasCTX);
	
	updateSpeciesData();
	setTimeout(tick, TICK_TIME);
}

// Draw all objects
function drawMap(ctx) {
	clearCanvas(canvasCTX);
	drawBackground(canvasCTX);
	
	// Update all of the ants in the sytem
	if (RUNNING) {
		TICK += 1;
		for (var i = 0; i < ANTS_LIST.length; i++)
			ANTS_LIST[i].update();
	}
	
	// Update each cell on the map
	for (var i = 0; i < NUM_OF_CELLS; i++) {		
			
		if (RUNNING) {			
			// Update and draw the pheromones in the cell
			for (var k = 0; k < MAP[i].pheromone.length; k++) {
				var pheromone = MAP[i].pheromone[k];
				pheromone.update();
			}	
		}
		
		// Draw only the first ant
		if (MAP[i].ant.length > 0) {
			var ant = MAP[i].ant[0];
			ant.draw(ctx);
		} else if (MAP[i].pheromone.length > 0) {
			var pheromone = MAP[i].pheromone[0];
			pheromone.draw(ctx);
		} else if (MAP[i].food !== void(0)) {		// Don't want to draw food on top of ants
			var food = MAP[i].food;
			food.draw(ctx);
		}
	}
	drawGrid(canvasCTX);
}

// Setups the environment when starting or restarting the simulation
function createEnviroment() {
	
	CURRENT_ID = 0;
	SPECIES_LIST = [];
	ANTS_LIST = [];
	RUNNING = true;
	
	// Remove previous data about old species
	getElement('data').innerHTML = '';
	
	// Create empty map
	createMap();
	
	// Create food system & add food
	FOOD = new FoodSystem();
	
	FOOD.addFood();
	
	// Create the users species
	USER_SPECIES = new Species(genID());
	USER_SPECIES.colour = {
		worker : '#1C1C1C',
		soldier : '#1C1C1C',
		queen : '#1C1C1C',
		nest : '#1C1C1C',
		pheromone : '#1C1C1C',
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
		a.species.ants.push(a);
		ANTS_LIST.push(a);
		
		// Start centred with the ant
		START_COORD.x = -x * CELL_SIZE.width + CANVAS.width/2;
		START_COORD.y = -y * CELL_SIZE.height + CANVAS.height/2;
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

var draging = false;

// Once the HTML is loaded
window.onload = function() {

	// Get canvas DOM & canvas context
	canvasDOM = getElement(CANVAS.name);
	canvasCTX = canvasDOM.getContext('2d');
	
	resizeElement(canvasDOM, CANVAS);
	
	// Add event listeners for key press
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
	
	canvasDOM.addEventListener('mousewheel', function(e) {
		// cross-browser wheel delta
		var e = window.event || e; // old IE support
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		zoom(delta * ZOOM_AMOUNT);
		e.preventDefault();		// prevent scrolling the page while zooming
	}, false);
	
	canvasDOM.onmousedown = function(e) {
		draging = true;
		start = {x : e.pageX, y : e.pageY};
	};
	
	var start = {x : 250, y : 310};
	var end = {x : 0, y : 0};
	
	canvasDOM.onmousemove = function(e) {
		if (draging) {
			end = {x : e.pageX, y : e.pageY};
			START_COORD.x = START_COORD.x + (end.x - start.x);
			START_COORD.y = START_COORD.y + (end.y - start.y);
			start = {x : e.pageX, y : e.pageY};
		}
	};
	
	window.onmouseup = function(e) {
		draging = false;
	};
	
	createEnviroment();
	
	// Set the sliders to their default values
	createCharacteristicInputs();
	
	tick();
};