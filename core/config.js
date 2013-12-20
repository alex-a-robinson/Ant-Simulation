/**
*	Holds all global constants
*/

var CURRENT_ID = 0;

// Misc
var VALUE_TYPE = {
	integerValue : 0,
	floatValue : 1
};

// Main
var TICK_TIME = 100;
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
	x : 200,
	y : 200
};
var NUM_OF_CELLS = GRID_SIZE.x * GRID_SIZE.y;

var DIR = {
	none : 0,
	north : 1,
	east : 2,
	south : -1,
	west : -2,
};

var MAP_BOUNDARY = {
	x : {min : 0, max : GRID_SIZE.x},
	y : {min : 0, max : GRID_SIZE.y}
};

// Food
var FOOD;
var FOOD_HUNGER_RATIO = 1;
var DEBUG_AMOUNT_OF_FOOD = 500;


// Ants
var GOAL = {
	findFood : 0,
	getFood : 1,
	dropFood : 2,
};

var DEBUG_ANT_NUM = 1;

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
var PHEROMONE_BASE_COLOUR = [
	['#0000FF', '#3333FF', '6666FF', '9999FF', 'CCCCFF']
];	// index is species id, value is colour
var PHEROMONE_EVAPERATION_RATE = 0.001;
var MAX_PHEROMONE_CONCENTRATION = 1;
var PHEROMONE_PULL_FACTOR = 500;
var MOMENTUM_INFLUENCE = 40;	// 0.2
var CHANGE_DIRECTION_THRESHOLD = 0.1;

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