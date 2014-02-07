// ---------- Worker depositing Food ----------

function tick() {
	testAnt.update();
	
	simpleGrid(CTX);
	for (var i = 0; i < NUM_OF_CELLS; i++) {
		if (MAP[i].ant.length > 0) {
			MAP[i].ant[0].draw(CTX);
		} else if (MAP[i].pheromone.length > 0) {
            var pheromone = MAP[i].pheromone[0];
            pheromone.draw(CTX);
        }
		
	}
	
	if (testAnt.carrying === 0)
		console.log('Food all deposited.');
	
	if (testAnt.goal === GOAL.dropFood) {
		setTimeout(tick, 1000);
		console.log('searching for nest');
	} else if (testAnt.goal === GOAL.findFood) {
		console.log('Goal updated to GOAl.findFood');
	}
		
}

/**
* Test case - Simulate an ant dropping food off at the nest
*						
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*   CELL_SIZE = {width : 50, height : 50};
*   GRID_SIZE = {width : 10, height : 10};
*   NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*   A single ant and nest
*/

var WorkerAntDepositingFoodTest = new testCase('Simulate an ant dropping food off at the nest');
WorkerAntDepositingFoodTest.autorun = true;

// Configure environment
MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
CELL_SIZE = {width : 50, height : 50};
GRID_SIZE = {width : 10, height : 10};
NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
STARTING_QUEEN_ANT_NUMBER = 0;
var CTX;

// Create the ant
var testAnt = new Worker(genID(), {x : 5, y : 5});
testAnt.species = new Species();	// starts with default values
testAnt.size = CELL_SIZE;	// starts with default values
testAnt.direction = 0;
testAnt.carrying = 3;

testAnt.goal = GOAL.dropFood;

createMap();

// Add Nest
var nest = new Nest(genID(), {x : 2, y : 2});
nest.species = testAnt.species;
testAnt.nest = nest;
nest.createNest();

WorkerAntDepositingFoodTest.createTest('N/A', [], 'desc', 'watch ant searching dropping off food at the nest.');

window.onload = function () {
	CTX = getElement(CANVAS.name).getContext('2d');
	setTimeout(tick, 1000);
}

WorkerAntDepositingFoodTest.summery();