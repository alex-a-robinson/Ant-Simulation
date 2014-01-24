// ---------- Ant.wonder ----------

function arrowTo(coord1, coord2, angle) {
	window.onload = function () {
		var ctx = getElement(CANVAS.name).getContext('2d');
		simpleGrid(ctx);
	
		drawRect(ctx, scaleCoord(coord1), CELL_SIZE, '#FF0000');
		drawRect(ctx, scaleCoord(coord2), CELL_SIZE, '#0000FF');
		
		ctx.save();
		
		var scaledCoord = scaleCoord(coord1);
	
		// Translate and rotate the canvas (done so can draw at an angle)
		ctx.translate(scaledCoord.x + CELL_SIZE.width/2, scaledCoord.y + CELL_SIZE.height/2);
		ctx.rotate(angle);
		
		drawLine(ctx, {x : 0, y : 0}, {x : 0, y : -100}, '#FF0000', 1);
		drawLine(ctx, {x : 0, y : -100}, {x : 5, y : -95}, '#FF0000', 1);
		drawLine(ctx, {x : 0, y : -100}, {x : -5, y : -95}, '#FF0000', 1);
		
		ctx.restore();
	}
}

function drawBlocks(centerBlock, blocks) {
	window.onload = function () {
		var ctx = getElement(CANVAS.name).getContext('2d');
		drawBackground(ctx);
		simpleGrid(ctx);
		
		for (var i = 0; i < blocks.length; i++) {
			drawRect(ctx, scaleCoord(blocks[i]), CELL_SIZE, '#0000FF');
		}		
		
		drawRect(ctx, scaleCoord(centerBlock), CELL_SIZE, '#FF0000');
	}
}

/**
* Test case - Test that ant picks correct direction given some amount of pheromones
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*	CELL_SIZE = {width : 10, height : 10};
*	GRID_SIZE = {width : 50, height : 50};
*	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*	A single ant in a static position with pheromones around it
*
* Test data - No pheromones in view [edge case]
* Expected  - this.direction === this.prioritizeDirection
*/

var AntWonderDirectionTest = new testCase('Test that ant picks correct direction given some amount of pheromones');

var testAntSpecies = {chars : {eyesight : 10, eyeAngle : Math.PI/2}};	// simulate a species
var testAnt = new Ant(1, {x : 25, y : 25});
testAnt.species = testAntSpecies;
testAnt.direction = 3.67;

MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
CELL_SIZE = {width : 10, height : 10};
GRID_SIZE = {width : 50, height : 50};
NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;

createMap();

// Simulate the dummy ants
MAP[coordToIndex({x : 18, y : 34})].ant = ['ant1'];
MAP[coordToIndex({x : 25, y : 22})].ant = ['ant2'];
MAP[coordToIndex({x : 30, y : 32})].ant = ['ant3', 'ant4'];

testAnt.scan();

AntScanVisibleAntsTest.createTest(testAnt.itemsInView.ants.length, [], 'equal', 0);

createMap();

// Simulate the dummy ants
MAP[coordToIndex({x : 26, y : 32})].ant = ['ant1'];
MAP[coordToIndex({x : 26, y : 29})].ant = ['ant2'];
MAP[coordToIndex({x : 23, y : 28})].ant = ['ant3', 'ant4'];

testAnt.scan();

AntScanVisibleAntsTest.createTest(testAnt.itemsInView.ants.length, [], 'equal', 4);
AntScanVisibleAntsTest.testAll();

AntScanVisibleAntsTest.summery();

/**
* Test case - Test that adds all food within viewing distance to ant.itemsInView.food
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*	CELL_SIZE = {width : 50, height : 50};
*	GRID_SIZE = {width : 10, height : 10};
*	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*	A single ant in a static position with multiple pieces of food around it
*
* Test data - No food in view [edge case]
* Expected  - this.itemsInView.food.length = 0 i.e. cannot see any food in view
*/

var AntScanVisibleAntsTest = new testCase('Test that adds all food within viewing distance to ant.itemsInView.food');

var testAntSpecies = {chars : {eyesight : 10, eyeAngle : Math.PI/2}};	// simulate a species
var testAnt = new Ant(1, {x : 25, y : 25});
testAnt.species = testAntSpecies;
testAnt.direction = 3.67;

MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
CELL_SIZE = {width : 10, height : 10};
GRID_SIZE = {width : 50, height : 50};
NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;

createMap();

// Simulate the dummy pieces of food
MAP[coordToIndex({x : 18, y : 34})].food = 'food1';
MAP[coordToIndex({x : 25, y : 22})].food = 'food2';
MAP[coordToIndex({x : 30, y : 32})].food = 'food3';

testAnt.scan();

AntScanVisibleAntsTest.createTest(testAnt.itemsInView.food.length, [], 'equal', 0);

createMap();

// Simulate the dummy pieces of food
MAP[coordToIndex({x : 26, y : 32})].food = 'food1';
MAP[coordToIndex({x : 26, y : 29})].food = 'food2';
MAP[coordToIndex({x : 23, y : 28})].food = 'food3';

testAnt.scan();

AntScanVisibleAntsTest.createTest(testAnt.itemsInView.food.length, [], 'equal', 3);
AntScanVisibleAntsTest.testAll();

AntScanVisibleAntsTest.summery();