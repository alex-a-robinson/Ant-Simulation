// ---------- Ant.smell ----------

/**
* Test case - Test that adds all pheromones within range to pheromonesInRange
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*	CELL_SIZE = {width : 50, height : 50};
*	GRID_SIZE = {width : 10, height : 10};
*	A single ant in a static position with multiple ants around it
*
* Test data - No pheromones in range [functional value]
* Expected  - this.pheromonesInRange.length = 0 i.e. cannot smell any pheromones in view
*
* Test data - 4 Pheromones in range with one ontop of the ant [functional value]
* Expected  - this.pheromonesInRange.length = 3
*/

var AntSmellTest = new testCase('Test that adds all pheromones within range to pheromonesInRange');
AntSmellTest.autorun = true;

var testAntSpecies = {chars : {antennaSize : 10, antennaAngle : Math.PI/2}};	// simulate a species
var testAnt = new Ant(1, {x : 25, y : 25});
testAnt.species = testAntSpecies;
testAnt.direction = 3.67;

MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
CELL_SIZE = {width : 10, height : 10};
GRID_SIZE = {width : 50, height : 50};
NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;

createMap();

// Simulate the dummy pheromones
MAP[coordToIndex({x : 10, y : 10})].pheromone = ['pheromone1'];
MAP[coordToIndex({x : 10, y : 15})].pheromone = ['pheromone2'];
MAP[coordToIndex({x : 12, y : 10})].pheromone = ['pheromone3', 'pheromone4'];

testAnt.smell();

AntSmellTest.createTest(testAnt.pheromonesInRange.length, [], 'equal', 0);

createMap();

// Simulate the dummy pheromones
MAP[coordToIndex({x : 25, y : 25})].pheromone = ['pheromone1'];
MAP[coordToIndex({x : 23, y : 26})].pheromone = ['pheromone2'];
MAP[coordToIndex({x : 22, y : 27})].pheromone = ['pheromone3', 'pheromone4'];

testAnt.smell();
AntSmellTest.createTest(testAnt.pheromonesInRange.length, [], 'equal', 3);

AntSmellTest.summery();