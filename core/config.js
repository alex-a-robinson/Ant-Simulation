var CURRENT_ID = 0;
var SPECIES_LIST = [];

// Misc
var VALUE_TYPE = {
	integerValue : 0,
	floatValue : 1
};

var RUNNING = false;

// Main
var TICK_TIME = 10;
var speciesList = [];
var ANTS_LIST = [];

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
var PLUS_KEY = 107;
var MINUS_KEY = 109;

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
var FOOD_HEALTH_RATIO = 50;

// Ants
var GOAL = {
	none : -1,
	findFood : 0,
	getFood : 1,
	dropFood : 2,
	pickDirection : 3,
	gotoNestSite : 4,
	createNest : 5,
	guardNest : 6,
	guardPheromone : 7,
	guardFood : 8,
	attack : 9
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
var QUEEN_STEPS = {min : 150, max : 300};

// Pheromones
var PHEROMONE_EVAPERATION_RATE = 0.005;
var MAX_PHEROMONE_CONCENTRATION = 1;
var CHANGE_DIRECTION_THRESHOLD = 0.05;
var PHEROMONE_INFLUENCE = 0.95;

// Species
var CHARS = {		// <---------------- SOME VALUES ARE INTEGERS AND SOME ARE FLOATS
	speed : {min : 0, max : 1, type : VALUE_TYPE.floatValue, id : 'char-speed', neatName : 'Speed', desc : 'speed charcteristic ...', step : 0.01, healthModifier : 21, defaultValue : 1.00, value : 1.00},
	antennaSize : {min : 0, max : 5, type : VALUE_TYPE.integerValue, id : 'char-antennaSize', neatName : 'Antenna Size', desc : 'Antenna charcteristic ...', step : 1, healthModifier : 21, defaultValue : 1, value : 1},
	exoSkeletonThickness : {min : 0, max : 5, type : VALUE_TYPE.integerValue, id : 'char-exoSkeletonThickness', neatName : 'Exoskeleton Thickness', desc : '...', step : 1, healthModifier : 21, defaultValue : 1, value : 1},
	jawStrength : {min : 0, max : 5, type : VALUE_TYPE.integerValue, id : 'char-jawStrength', neatName : 'Jaw Strength', desc : '...', step : 1, healthModifier : 21, defaultValue : 1, value : 1},
	jawSize : {min : 0, max : 5, type : VALUE_TYPE.integerValue, id : 'char-jawSize', neatName : 'Jaw Size', desc : '...', step : 1, healthModifier : 21, defaultValue : 1, value : 1},
	stingSize : {min : 0, max : 5, type : VALUE_TYPE.integerValue, id : 'char-stingSize', neatName : 'Sting Size', desc : '...', step : 1, healthModifier : 21, defaultValue : 1, value : 1},
	eyesight : {min : 0, max : 50, type : VALUE_TYPE.integerValue, id : 'char-eyeSight', neatName : 'Eye Sight', desc : '...', step : 1, healthModifier : 21, defaultValue : 1, value : 1},
	eyeAngle : {min : 0, max : Math.PI*2, type : VALUE_TYPE.floatValue, id : 'char-eyeAngle', neatName : 'Eye Angle', desc : '...', step : 0.01, healthModifier : 21, defaultValue : 1.00, value : 1.00},
	antennaAngle : {min : 0, max : Math.PI*2, type : VALUE_TYPE.floatValue, id : 'char-antennaAngle', neatName : 'Antenna Angle', desc : '...', step : 0.01, healthModifier : 21, defaultValue : 1.00, value : 1.00},
	pheromoneConcentration : {min : 0, max : 2, type : VALUE_TYPE.floatValue, id : 'char-pheromoneConcentration', neatName : 'Pheromone Concentration', desc : '...', step : 0.01, healthModifier : 21, defaultValue : 1.00, value : 1.00}
};

var USER_SPECIES;