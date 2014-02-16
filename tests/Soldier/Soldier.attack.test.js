// ---------- Solider attack ----------

function tick() {
	testAnt.update();
	targetAnt.update();
	
	simpleGrid(CTX);
	for (var i = 0; i < NUM_OF_CELLS; i++) {
		if (MAP[i].ant.length > 0) {
			MAP[i].ant[0].draw(CTX);
		}
	}
	
	if (testAnt.targetAnt !== void(0)) {
		console.log('Target aquired, following.');
	}
	
	if (targetAnt.dead === true) {
		console.log('Target ant has died.');
	} else {
		setTimeout(tick, 10);
		console.log('searching for target ant');
	}
}

/**
* Test case - Simulate a soldier ant attacking a worker an from another species
*						
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*   CELL_SIZE = {width : 10, height : 10};
*   GRID_SIZE = {width : 50, height : 50};
*   NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*   A single ant and nest
*/

var SoldierAttackTest = new testCase('Simulate a soldier ant attacking a worker an from another species');
SoldierAttackTest.autorun = true;

// Configure environment
MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
CELL_SIZE = {width : 10, height : 10};
GRID_SIZE = {width : 50, height : 50};
NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
STARTING_QUEEN_ANT_NUMBER = 0;
NEST_GUARD_RADIUS = 20;
var CTX;

// Create the soldier ant
var testAnt = new Soldier(genID(), {x : 30, y : 30});
testAnt.species = new Species();	// starts with default values
testAnt.size = CELL_SIZE;	// starts with default values

testAnt.goal = GOAL.guardPheromone; // i.e. just wonder around

// Add target ant
var targetAnt = new Worker(genID(), {x : 5, y : 35});
targetAnt.species = new Species();	// starts with default values
targetAnt.size = CELL_SIZE;	// starts with default values
targetAnt.health = 5000;

createMap();


SoldierAttackTest.createTest('N/A', [], 'desc', 'Watch solidier ant find other ant, follow it and then attack it.');

window.onload = function () {
	CTX = getElement(CANVAS.name).getContext('2d');
	setTimeout(tick, 10);
}

SoldierAttackTest.summery();