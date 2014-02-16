// ---------- Solidier guard food ----------

function tick() {
	testAnt.update();
	
	simpleGrid(CTX);
	for (var i = 0; i < NUM_OF_CELLS; i++) {
		if (MAP[i].ant.length > 0) {
			MAP[i].ant[0].draw(CTX);
		} else if (MAP[i].food !== void(0))
			MAP[i].food.draw(CTX);	
	}
	
	if (testAnt.moving === false) {
		console.log('Found food and guarding it.');
	} else if (testAnt.goal === GOAL.guardFood) {
		setTimeout(tick, 10);
		console.log('searching for food');
	}
}

/**
* Test case - Simulate a single ant guarding a food supply
*						
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*   CELL_SIZE = {width : 10, height : 10};
*   GRID_SIZE = {width : 50, height : 50};
*   NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*   A single ant and nest
*/

var SoldierGuardFoodTest = new testCase('Simulate a single ant guarding a food supply');
SoldierGuardFoodTest.autorun = true;

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

testAnt.goal = GOAL.guardFood;

createMap();

// Add Food
var fs = new FoodSystem();
fs.variation.max = 1;
MAP[coordToIndex({x : 25, y : 25})].food = new Food(fs, 1, {x : 25, y : 25});

SoldierGuardFoodTest.createTest('N/A', [], 'desc', 'watch ant find food and guard it.');

window.onload = function () {
	CTX = getElement(CANVAS.name).getContext('2d');
	setTimeout(tick, 10);
}

SoldierGuardFoodTest.summery();