var CURRENT_ID = 0;

// Misc
var VALUE_TYPE = {
	integerValue : 0,
	floatValue : 1
};

// Main
var TICK_TIME = 10
var speciesList = [];
var antsList = [];

// Canvas
var CANVAS = {
	name : 'simulation',
	width : 500,
	height : 500
};

// Map
var MAP = [];
var GRID_COLOUR = '#000000';
var BACKGROUND_COLOUR = '#5C3700';
var GRID_LINE_WIDTH = 0.2;
var CELL_SIZE = {
	width : 2,
	height : 2
};
var GRID_SIZE = {	// should be width and height! rather then x and y
	x : 250,
	y : 250
};
var NUM_OF_CELLS = GRID_SIZE.x * GRID_SIZE.y;
var MAP_BOUNDARY = {
	x : {min : 0, max : GRID_SIZE.x},
	y : {min : 0, max : GRID_SIZE.y}
};

// Food
var FOOD;
var FOOD_HEALTH_RATIO = 500;

// Ants
var GOAL = {
	findFood : 0,
	getFood : 1,
	dropFood : 2,
};
var DEBUG_ANT_NUM = 1;
var NEST_COORD_MEMORY = 0.1;
var NEST_SIZE = {
	x : 3,
	y : 3
};
var ANT_TYPE = {
	queen : 0,
	worker : 1,
	soldier : 2,
	nest : 3,
	debug : 4
};
var ANT_FOOD_TAKE_SPEED = 1;	// number of ticks it takes for an ant to take one peice of food

// Pheromones
var PHEROMONE_EVAPERATION_RATE = 0.001;
var MAX_PHEROMONE_CONCENTRATION = 2;
var CHANGE_DIRECTION_THRESHOLD = 0.05;
var PHEROMONE_INFLUENCE = 0.95;

// Species
var CHAR_RANGE = {		// <---------------- SOME VALUES ARE INTEGERS AND SOME ARE FLOATS
	speed : {min : 0, max : 10, type : VALUE_TYPE.integerValue},
	antennaSize : {min : 0, max : 5, type : VALUE_TYPE.integerValue},
	exoSkeletonThickness : {min : 0, max : 5, type : VALUE_TYPE.integerValue},
	jawStrength : {min : 0, max : 5, type : VALUE_TYPE.integerValue},
	jawSize : {min : 0, max : 5, type : VALUE_TYPE.integerValue},
	stingSize : {min : 0, max : 5, type : VALUE_TYPE.integerValue},
	eyesight : {min : 0, max : 50, type : VALUE_TYPE.integerValue},
	pheromoneConcentration : {type : VALUE_TYPE.floatValue}
}