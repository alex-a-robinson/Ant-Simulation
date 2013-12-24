var CURRENT_ID = 0;

// Misc
var VALUE_TYPE = {
	integerValue : 0,
	floatValue : 1
};

// Main
var TICK_TIME = 10;
var speciesList = [];
var antsList = [];

// Canvas
var CANVAS = {
	name : 'simulation',
	width : 500,
	height : 500,
	offset : {
		x : 0,
		y : 0
	}
};

var START_COORD = {
	x : 0,
	y : 0
};

var LEFT_ARROW_KEY = 37;
var RIGHT_ARROW_KEY = 39;
var UP_ARROW_KEY = 38;
var DOWN_ARROW_KEY = 40;

// Map
var MAP = [];
var GRID_COLOUR = '#000000';
var BACKGROUND_COLOUR = '#C2AB8A';
var OUT_OF_BOUNDS_COLOUR = '#FFFFFF';
var GRID_LINE_WIDTH = 0.2;
var CELL_SIZE = {
	width : 10,
	height : 10
};
var GRID_SIZE = {	// should be width and height! rather then x and y
	x : 50,
	y : 50
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
	none : -1,
	findFood : 0,
	getFood : 1,
	dropFood : 2,
	pickDirection : 3,
	gotoNestSite : 4,
	createNest : 5
};
var DEBUG_ANT_NUM = 1;
var NEST_COORD_MEMORY = 0.1;
var NEST_SIZE = {
	width : 1,
	height : 1
};
var ANT_TYPE = {
	queen : 0,
	worker : 1,
	soldier : 2,
	nest : 3,
	debug : 4
};
var ANT_FOOD_DROP_SPEED = 1;
var ANT_FOOD_TAKE_SPEED = 1;	// number of ticks it takes for an ant to take one peice of food
var QUEEN_STEPS = {min : 200, max : 300};

// Pheromones
var PHEROMONE_EVAPERATION_RATE = 0.005;
var MAX_PHEROMONE_CONCENTRATION = 1;
var CHANGE_DIRECTION_THRESHOLD = 0.05;
var PHEROMONE_INFLUENCE = 0.95;

// Species
var CHAR_RANGE = {		// <---------------- SOME VALUES ARE INTEGERS AND SOME ARE FLOATS
	speed : {min : 0, max : 2.5, type : VALUE_TYPE.floatValue},
	antennaSize : {min : 0, max : 5, type : VALUE_TYPE.integerValue},
	exoSkeletonThickness : {min : 0, max : 5, type : VALUE_TYPE.integerValue},
	jawStrength : {min : 0, max : 5, type : VALUE_TYPE.integerValue},
	jawSize : {min : 0, max : 5, type : VALUE_TYPE.integerValue},
	stingSize : {min : 0, max : 5, type : VALUE_TYPE.integerValue},
	eyesight : {min : 0, max : 50, type : VALUE_TYPE.integerValue},
	eyeAngle : {min : 0, max : Math.PI*2, type : VALUE_TYPE.floatValue},
	antennaAngle : {min : 0, max : Math.PI*2, type : VALUE_TYPE.floatValue},
	pheromoneConcentration : {min : 0, max : 2, type : VALUE_TYPE.floatValue}
}