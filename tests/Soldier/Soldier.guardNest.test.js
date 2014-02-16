// ---------- Solidier guard nest ----------

function tick() {
	testAnt.update();
	
	simpleGrid(CTX);
	for (var i = 0; i < NUM_OF_CELLS; i++) {
		if (MAP[i].ant.length > 0) {
			MAP[i].ant[0].draw(CTX);
		}
		
	}
	
	
	if (testAnt.steps > 0)
		console.log('Found nest, going to guard distance');
	if (testAnt.moving === false) {
		console.log('Guarding.');
	} else if (testAnt.goal === GOAL.guardNest) {
		setTimeout(tick, 100);
		console.log('searching for nest');
	}
}

/**
* Test case - Simulate a single ant guarding its nest
*						
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*   CELL_SIZE = {width : 10, height : 10};
*   GRID_SIZE = {width : 50, height : 50};
*   NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*   A single ant and nest
*/

var SoldierGuardNestTest = new testCase('Simulate a single ant guarding its nest');
SoldierGuardNestTest.autorun = true;

// Configure environment
MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
CELL_SIZE = {width : 10, height : 10};
GRID_SIZE = {width : 50, height : 50};
NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
STARTING_QUEEN_ANT_NUMBER = 0;
NEST_GUARD_RADIUS = 20;
var CTX;

// Create the ant
var testAnt = new Soldier(genID(), {x : 80, y : 80});
testAnt.species = new Species();	// starts with default values
testAnt.size = CELL_SIZE;	// starts with default values
testAnt.direction = 0;

testAnt.goal = GOAL.guardNest;

createMap();

// Add Nest
var nest = new Nest(genID(), {x : 25, y : 25});
nest.species = testAnt.species;
testAnt.nest = nest;
nest.createNest();

SoldierGuardNestTest.createTest('N/A', [], 'desc', 'watch ant find nest and guard it.');

window.onload = function () {
	CTX = getElement(CANVAS.name).getContext('2d');
	setTimeout(tick, 1000);
}

SoldierGuardNestTest.summery();