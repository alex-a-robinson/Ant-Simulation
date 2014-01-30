// ---------- Worker finding Food ----------

function basicMapDraw() {
	console.log('b')
	var ctx = getElement(CANVAS.name).getContext('2d');
	
	for (var i = 0; i < NUM_OF_CELLS; i++) {
		if (MAP[i].ant.length > 0) {
			MAP[i].ant[0].draw(ctx);
		}
		else if (MAP[i].food !== void(0))
			MAP[i].food.draw(ctx);
	}
}

function tick() {
	testAnt.update();
	
	simpleGrid(CTX);
	testAnt.draw(CTX);
	MAP[coordToIndex({x : 2, y : 8})].food.draw(CTX);
	
	var blocks =  getSector(testAnt.coord, testAnt.species.chars.eyesight, 
                            testAnt.direction, testAnt.species.chars.eyeAngle)
	for (var i = 0; i < blocks.length; i++) {
		drawRect(CTX, scaleCoord(blocks[i]), CELL_SIZE, '#0000FF');
	}
	
	if (testAnt.target !== void(0))
		console.log('Found food target.')
	
	if (testAnt.goal === GOAL.findFood) {
		setTimeout(tick, 1000);
		console.log('searching for food');
	} else if (testAnt.goal === GOAL.getFood) {
		console.log('Goal updated to GOAl.getFood');
	}
		
}

/**
* Test case - Simulate a single ant looking for food
* 				GOAL -> findFood,
*				wonder + scan + findFoodTarget,
*				if spot food:
*					GOAL.getFood
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*   CELL_SIZE = {width : 50, height : 50};
*   GRID_SIZE = {width : 10, height : 10};
*   NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*   A single ant in a static position with multiple ants around it
*
* Test data - A single ant and a single piece of food
* Expected  - this.itemsInView.ants.length = 0 i.e. cannot see any ants in view
*/

var WorkerAntFindingFoodTest = new testCase('Simulate a single worker ant looking for food');
WorkerAntFindingFoodTest.autorun = true;

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

createMap();

// Add food
var fs = new FoodSystem();
fs.variation.max = 1;
MAP[coordToIndex({x : 2, y : 8})].food = new Food(fs, 1, {x : 2, y : 8});

WorkerAntFindingFoodTest.createTest('N/A', [], 'desc', 'watch ant searching for food, targeting food and updating its goal.');

window.onload = function () {
	CTX = getElement(CANVAS.name).getContext('2d');
	setTimeout(tick, 1000);
}

WorkerAntFindingFoodTest.summery();