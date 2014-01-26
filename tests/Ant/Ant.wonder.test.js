// ---------- Ant.wonder ----------

function arrowTo(coord1, angle, blocks) {
	window.onload = function () {
		var ctx = getElement(CANVAS.name).getContext('2d');
		simpleGrid(ctx);

		drawRect(ctx, scaleCoord(coord1), CELL_SIZE, '#FF0000');
		
		for (var i = 0; i < blocks.length; i++) {
			drawRect(ctx, scaleCoord(blocks[i]), CELL_SIZE, '#0000FF');
		}
		
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

/**
* Test case - Test that ant picks correct direction given some amount of pheromones
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*	CELL_SIZE = {width : 10, height : 10};
*	GRID_SIZE = {width : 50, height : 50};
*	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*	MAX_PHEROMONE_CONCENTRATION = 1;
*	A single ant in a static position with pheromones around it
*
* Test data - No pheromones in view [functional value]
* Expected  - this.direction === this.prioritizeDirection
*
* Test data - A single pheromone [functional value]
* Expected  - Ant is pointing at the pheromone
*
* Test data - Multiple pheromones [functional value]
* Expected  - Ant is pointing slightly upwards to the right
*/

var AntWonderDirectionTest = new testCase('Test that ant picks correct direction given some amount of pheromones');

var testAntSpecies = {chars : {antennaSize : 10, antennaAngle : 2*Math.PI, exploitativeness : 1, pheromoneInfluence : 1}}	// simulate a species
var testAnt = new Ant(1, {x : 25, y : 25});
testAnt.species = testAntSpecies;
testAnt.direction = 0;

AntWonderDirectionTest.callwith = testAnt;
AntWonderDirectionTest.autorun = true;

MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
CELL_SIZE = {width : 10, height : 10};
GRID_SIZE = {width : 50, height : 50};
NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
MAX_PHEROMONE_CONCENTRATION = 1;

createMap();

testAnt.smell();
testAnt.wonder();

AntWonderDirectionTest.createTest(testAnt.direction, [], 'equal', testAnt.prioritizeDirection);

arrowTo({x : 25, y : 25}, testAnt.direction, []);

// 2

createMap();

// Simulate the dummy pheromones
MAP[coordToIndex({x : 27, y : 22})].pheromone = [{coord : {x : 27, y : 22}, species : testAntSpecies, concentration : 0.4}];

testAnt.smell();
testAnt.wonder();

arrowTo({x : 25, y : 25}, testAnt.direction, [{x : 27, y : 22}]);

// 3

createMap();

// Simulate the dummy pheromones
MAP[coordToIndex({x : 18, y : 22})].pheromone = [{coord : {x : 18, y : 22}, species : testAntSpecies, concentration : 0.4}];
MAP[coordToIndex({x : 18, y : 20})].pheromone = [{coord : {x : 18, y : 20}, species : testAntSpecies, concentration : 0.4}];
MAP[coordToIndex({x : 18, y : 28})].pheromone = [{coord : {x : 18, y : 28}, species : testAntSpecies, concentration : 0.4}];

testAnt.smell();
testAnt.wonder();

arrowTo({x : 25, y : 25}, testAnt.direction, [{x : 18, y : 22}, {x : 18, y : 20}, {x : 18, y : 28}]);