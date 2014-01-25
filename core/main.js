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
		drawBackground(canvasCTX);
		
		// Update all of the ants in the sytem
		for (var i = 0; i < ANTS_LIST.length; i++)
			ANTS_LIST[i].update();
		
		// Update each cell on the map
		for (var i = 0; i < NUM_OF_CELLS; i++) {		
			var coord = indexToCoord(i);
			if (1 || visible(coord)) {
				
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
				} else if (MAP[i].food !== void(0)) {		// Don't want to draw food on top of ants
					var food = MAP[i].food;
					food.draw(ctx);
				}
			}
		}
		drawGrid(canvasCTX);
	}
}

// Setups the environment when starting or restarting the simulation
function createEnviroment() {
	
	CURRENT_ID = 0;
	SPECIES_LIST = [];
	ANTS_LIST = [];
	RUNNING = true;
	
	// Remove previous data about old species
	var speciesClass = document.getElementsByClassName('species');
	for (var i = 0; i < speciesClass.length; i++) {
		var DOM = speciesClass[i];
		DOM.parentElement.removeChild(DOM);
	}
	
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
	
	canvasDOM.addEventListener("mousewheel", function(e) {
		// cross-browser wheel delta
		var e = window.event || e; // old IE support
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		
		zoom(delta * ZOOM_AMOUNT);
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
	
	canvasDOM.onmouseup = function(e) {
		draging = false;
	};
	
	createEnviroment();
	
	// Set the sliders to their default values
	createCharacteristicInputs();
	
	tick();
};