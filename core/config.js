// ---------- MISC ----------
var TICK = 0;
var PAN_AMOUNT = 15;
var ZOOM_AMOUNT = 0.5;
var VALUE_TYPE = {		// Used to signify if a variable is an integer or float
	integerValue : 0,
	floatValue : 1
};
var INPUT_TYPE = {
	slider : 0,
	button : 1,
	colour : 2
};

// ---------- MAIN ----------
var TICK_TIME = 10;		// The time between ticks
var CURRENT_ID = 0;		// Used to keep track of the latest unique ID (so previous IDs are not reused)
var ANTS_LIST = [];		// Holds all ant objects
var SPECIES_LIST = [];	// Holds all species objects
var RUNNING = false;	// Determines whether the simulation is running or not


// ---------- CANVAS ----------
var CANVAS = {			// Used to define characteristics about the simulations canvas
	name : 'simulation',
	width : 500,
	height : 500,
};


// ---------- CONTROLS ----------
var AVERAGE_DELTA_FOOD_SAMPLE_RATE = 100;		// The number of ticks to wait been sampling for averages
var AVERAGE_FOOD_SAMPLE_RATE = 10;		// The number of ticks to wait been sampling for averages
var NUMBER_OF_FIXED_PLACES = 0;		// The number of numbers after the decimal place to display
var SELECTED_SPECIES;
var SELECTED_COLOUR = '#A5C7D9';
var UNSELECTED_COLOUR = '#FFFFFF';
var BUTTON_UPDATE_COLOUR = '#FF0000';	// The colour of a button when settings have changed and the update needs to be pushed to the simulation
var BUTTON_NO_UPDATE_COLOUR = '#000000';	// The normal colour of a button when no settings have been altered
var LEFT_ARROW_KEY = 37;	// The key number for left arrow
var RIGHT_ARROW_KEY = 39;
var UP_ARROW_KEY = 38;
var DOWN_ARROW_KEY = 40;
var PLUS_KEY = 107;
var MINUS_KEY = 109;
var MIN_ZOOM = 1;
var MAX_ZOOM = 14;
var START_COORD = {			// The offset coordinate for the current view when panning around
	x : 0,
	y : 0
};


// ---------- MAP ----------
var MAP = [];	// Holds all objects displayed on the map
var GRID_COLOUR = '#000000';
var BACKGROUND_COLOUR = '#C2AB8A';//'#C2AB8A';
var OUT_OF_BOUNDS_COLOUR = '#FFFFFF';	// Used if panning around off map
var GRID_LINE_WIDTH = 0.2;
var CELL_SIZE = {	// The size in pixels of a single cell on the grid
	width : 6,
	height : 6
};
var GRID_SIZE = {	// The size in number of cells of the grid (actual size displayed depends on CELL_SIZE)
	width : 250,
	height : 250
};
var MAP_BOUNDARY = {	// Used to determine whether an ant is in bounds or not
	x : {min : 0, max : GRID_SIZE.width},
	y : {min : 0, max : GRID_SIZE.height}
};
var NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;	// The total number of cells


// ---------- FOOD ----------
var FOOD;	// A variable holding the global food system
var FOOD_HEALTH_RATIO = 50;		// The ratio of food to health used for ants
var FOOD_CHANCE = 0.0004;	// The probability of a food source spawning in a cell


// ---------- ANTS ----------
var STARTING_QUEEN_ANT_NUMBER = 1;
var ANT_FOOD_DROP_SPEED = 1;	// The number of ticks it takes for an ant to drop a single piece of food
var ANT_FOOD_TAKE_SPEED = 1;	// The number of ticks it takes for an ant to take a single piece of food
var DAMAGE_MULTIPLIER = 100;	// DAMAGE_MULTIPLIER * species.chars.jawStrenght -> The amount of health a solider ant takes from ants its attacking

var GOAL = {	// Ant goals used to determine ant actions
	none : -1,	// No current goal, results to default for particular ant
	findFood : 0,	// Make ant look for food
	getFood : 1,	// Make ant go towards and pick up nearby food
	dropFood : 2,	// Make ant look for nest and when can see nest deposit food at the nest
	pickDirection : 3,	// Used by Queens to pick a direction to travel
	gotoNestSite : 4,	// Used by Queens to head in the chosen direction towards the nest site
	createNest : 5,		// Used by Queens to create a nest
	guardNest : 6,
	guardPheromone : 7,
	guardFood : 8,
	attack : 9
};
var NEST_SIZE = {	// The extra size of a nest in cells e.g. {width : 1, height : 1} means go 1 extra cell in both sides and 1 extra cell both up and down.
	width : 1,
	height : 1
};
var ANT_TYPE = {	// Used to show the type of ant
	queen : 0,
	worker : 1,
	soldier : 2,
	nest : 3,
	debug : 4
};


// ---------- PHEROMONES ----------
var PHEROMONE_EVAPERATION_RATE = 0.005;		// The global amount all pheromone concentrations reduce by each tick
var MAX_PHEROMONE_CONCENTRATION = 1;		// The maximum concentration a pheromone can have

// ---------- SPECIES ----------
var USER_SPECIES;		// Holds the users species so that it can be updated as the simulation runs
var CHARS = {	// Holds properties of all characteristics species
				// min - The minimum values a characteristic can be
				// max - The maximum values a characteristic can be
				// type - The type of value the characteristic can be i.e. a float or integer
				// id - The HTML ID property of the characteristic used when creating inputs
				// neatName - The name used in a label in the HTML
				// desc - Short for description, used to describe what the characteristic affects
				// step - The minimum change in the characteristics value, used for creating HTML inputs
				// healthModifier - The amount of extra health needed to create an ant per step i.e. if {value : 24, step : 1, healthModifier : 5} Then value/step * healthModifier is the extra health an ant needs to be created
				// defaultValue - The Default Value a characteristic has
				// value - The actual value of the HTML input
				// editable - Determines if a characteristic can be edited

	speed : {min : 0, max : 1, type : VALUE_TYPE.floatValue, id : 'char-speed', neatName : 'Speed', desc : 'The speed that an ant can move', step : 0.01, healthModifier : 50, defaultValue : 0.25, value : 0.25, editable : true, inputType : INPUT_TYPE.slider},
	jawStrength : {min : 0, max : 25, type : VALUE_TYPE.integerValue, id : 'char-jawStrength', neatName : 'Jaw Strength', desc : 'The stength of the ants jaw (determins how much food the ant can carry)', step : 1, healthModifier : 4, defaultValue : 10, value : 10, editable : true, inputType : INPUT_TYPE.slider},
	jawSize : {min : 0, max : 5, type : VALUE_TYPE.integerValue, id : 'char-jawSize', neatName : 'Jaw Size', desc : 'The amount of damage a soldier ant does when attack', step : 1, healthModifier : 5, defaultValue : 1, value : 1, editable : true, inputType : INPUT_TYPE.slider},
	stingSize : {min : 0, max : 5, type : VALUE_TYPE.integerValue, id : 'char-stingSize', neatName : 'Sting Size', desc : 'The range which a soldier ant can attack', step : 1, healthModifier : 5, defaultValue : 1, value : 1, editable : true, inputType : INPUT_TYPE.slider},
	eyesight : {min : 0, max : 10, type : VALUE_TYPE.integerValue, id : 'char-eyeSight', neatName : 'Eye Sight', desc : 'The range of cells an ant can see around it', step : 1, healthModifier : 10, defaultValue : 5, value : 5, editable : true, inputType : INPUT_TYPE.slider},
	eyeAngle : {min : 0, max : Math.PI*2, type : VALUE_TYPE.floatValue, id : 'char-eyeAngle', neatName : 'Eye Angle', desc : 'The angle at which an ant can see', step : 0.01, healthModifier : 10, defaultValue : Math.PI/2, value : Math.PI/2, editable : true, inputType : INPUT_TYPE.slider},
	antennaSize : {min : 0, max : 10, type : VALUE_TYPE.integerValue, id : 'char-antennaSize', neatName : 'Antenna Size', desc : 'The angle at which an ant can detect pheromones', step : 1, healthModifier : 2, defaultValue : 5, value : 5, editable : true, inputType : INPUT_TYPE.slider},
	antennaAngle : {min : 0, max : Math.PI*2, type : VALUE_TYPE.floatValue, id : 'char-antennaAngle', neatName : 'Antenna Angle', desc : 'The range of cells an ant can detect pheromones', step : 0.01, healthModifier : 10, defaultValue : Math.PI/2, value : Math.PI/2, editable : true, inputType : INPUT_TYPE.slider},
	pheromoneConcentration : {min : 0, max : 2, type : VALUE_TYPE.floatValue, id : 'char-pheromoneConcentration', neatName : 'Pheromone Concentration', desc : 'The concentration of pheromones an ant can secrete', step : 0.01, healthModifier : 15, defaultValue : 0.4, value : 0.4, editable : true, inputType : INPUT_TYPE.slider},
	nestCoordMemory : {min : 0, max : 1, type : VALUE_TYPE.floatValue, id : 'char-nestCoordMemory', neatName : 'Nest Coordinate Memory', desc : 'A measure of how well the ant knows where the nest is, used when navigating to the nest, represents memory of familiarly landmarks near the nest', step : 0.01, healthModifier : 50, defaultValue : 0.1, value : 0.1, editable : true, inputType : INPUT_TYPE.slider},
	exploitativeness : {min : 0, max : 1, type : VALUE_TYPE.floatValue, id : 'char-exploitativeness', neatName : 'Exploitativeness', desc : 'The likelihood of an ant changing direction rather then continue going in the direction its facing', step : 0.01, healthModifier : 0, defaultValue : 0.05, value : 0.05, editable : true, inputType : INPUT_TYPE.slider},
	pheromoneInfluence : {min : 0, max : 1, type : VALUE_TYPE.floatValue, id : 'char-pheromoneInfluence', neatName : 'Pheromone Influence', desc : 'How likely it is that an ant will follow a pheromones', step : 0.01, healthModifier : 0, defaultValue : 0.90, value : 0.90, editable : true, inputType : INPUT_TYPE.slider},
	reproductionWorkerProb : {min : 0, max : 1, type : VALUE_TYPE.floatValue, id : 'char-reproductionWorkerProb', neatName : 'Worker ant probibility', desc : 'The probability of a worker ant being born compared with other types of ants', step : 0.05, healthModifier : 0, defaultValue : 0.5, value : 0.5, editable : true, inputType : INPUT_TYPE.slider},
	reproductionWorkerFoodCost : {min : 0, max : 50, type : VALUE_TYPE.floatValue, id : 'char-reproductionWorkerFoodCost', neatName : 'Worker ant food cost', desc : 'The amount of food required to create a worker ant (The ant starts with this amount of health)', step : 0.1, healthModifier : 0, defaultValue : 5, value : 5, editable : true, inputType : INPUT_TYPE.slider},
	reproductionSoldierProb : {min : 0, max : 1, type : VALUE_TYPE.floatValue, id : 'char-reproductionSoldierProb', neatName : 'Soldier ant probibility', desc : 'The probability of a soldier ant being born compared with other types of ants', step : 0.05, healthModifier : 0, defaultValue : 0.1, value : 0.1, editable : true, inputType : INPUT_TYPE.slider},
	reproductionSoldierFoodCost : {min : 0, max : 50, type : VALUE_TYPE.floatValue, id : 'char-reproductionSoldierFoodCost', neatName : 'Soldier ant food cost', desc : 'The amount of food required to create a soldier ant (The ant starts with this amount of health)', step : 0.1, healthModifier : 0, defaultValue : 8, value : 8, editable : true, inputType : INPUT_TYPE.slider},
	reproductionQueenProb : {min : 0, max : 1, type : VALUE_TYPE.floatValue, id : 'char-reproductionQueenProb', neatName : 'Queen ant probibility', desc : 'The probability of a queen ant being born compared with other types of ants', step : 0.05, healthModifier : 0, defaultValue : 0.05, value : 0.05, editable : true, inputType : INPUT_TYPE.slider},
	reproductionQueenFoodCost : {min : 0, max : 50, type : VALUE_TYPE.floatValue, id : 'char-reproductionQueenFoodCost', neatName : 'Queen ant food cost', desc : 'The amount of food required to create a queen ant (The ant starts with this amount of health)', step : 0.1, healthModifier : 0, defaultValue : 25, value : 25, editable : true, inputType : INPUT_TYPE.slider},
	queenStepsMin : {min : 0, max : 2000, type : VALUE_TYPE.integerValue, id : 'char-queenStepsMin', neatName : 'Minimum number of Queen steps', desc : 'The minimum number of steps a queen will take until it reaches its new nest site', step : 1, healthModifier : 0, defaultValue : 200, value : 200, editable : true, inputType : INPUT_TYPE.slider},
	queenStepsMax : {min : 0, max : 2000, type : VALUE_TYPE.integerValue, id : 'char-queenStepsMax', neatName : 'Maximum number of Queen steps', desc : 'The maximum number of steps a queen will take until it reaches its new nest site', step : 1, healthModifier : 0, defaultValue : 800, value : 800, editable : true, inputType : INPUT_TYPE.slider},
	reproductionRate : {min : 0, max : 1, type : VALUE_TYPE.floatValue, id : 'char-reproductionRate', neatName : 'Reproduction Rate', desc : 'The chance each tick of a new ant being born', step : 0.05, healthModifier : 0, defaultValue : 0.05, value : 0.05, editable : true, inputType : INPUT_TYPE.slider}
};