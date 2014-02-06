// ---------- Ant.secrete ----------

/**
* Test case - Test that adds pheromone of correct concentration
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*	CELL_SIZE = {width : 50, height : 50};
*	GRID_SIZE = {width : 10, height : 10};
*	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*	MAX_PHEROMONE_CONCENTRATION = 1;
*	A single ant in a static position with pheromones under it
*
* Test data - No pheromones to start [functional value]
* Expected  - A new pheromones of concentration 0.5
*
* Test data - A pheromone of the same species (testing adds pheromones) [functional value]
* Expected  - A new pheromones of concentration 0.9 i.e. 0.4 + 0.5
*
* Test data - A pheromone of a different species (testing dosn't add pheromones) [functional value]
* Expected  - A new pheromones of concentration 0.5
*
* Test data - A pheromone of the same species (testing does not exceed MAX_PHEROMONE_CONCENTRATION) [functional value]
* Expected  - A new pheromones of concentration 1
*/

var AntSecreteTest = new testCase('Test that adds pheromone of correct concentration');
AntSecreteTest.autorun = true;

var testAntSpecies = {chars : {pheromoneConcentration : 0.5}};	// simulate a species
var testAnt = new Ant(1, {x : 25, y : 25});
testAnt.species = testAntSpecies;
testAnt.direction = 3.67;

MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
CELL_SIZE = {width : 10, height : 10};
GRID_SIZE = {width : 50, height : 50};
NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
MAX_PHEROMONE_CONCENTRATION = 1;

createMap();
testAnt.secrete();
AntSecreteTest.createTest(MAP[coordToIndex({x : 25, y : 25})].pheromone.length, [], 'equal', 1);
AntSecreteTest.createTest(MAP[coordToIndex({x : 25, y : 25})].pheromone[0].concentration, [], 'equal', 0.5);

createMap();
// Simulate the dummy pheromone
MAP[coordToIndex({x : 25, y : 25})].pheromone = [{species : testAntSpecies, concentration : 0.4}];
testAnt.secrete();
AntSecreteTest.createTest(MAP[coordToIndex({x : 25, y : 25})].pheromone.length, [], 'equal', 1);
AntSecreteTest.createTest(MAP[coordToIndex({x : 25, y : 25})].pheromone[0].concentration, [], 'equal', 0.9);

createMap();
// Simulate the dummy pheromone
MAP[coordToIndex({x : 25, y : 25})].pheromone = [{species : 0, concentration : 0.4}];
testAnt.secrete();
AntSecreteTest.createTest(MAP[coordToIndex({x : 25, y : 25})].pheromone.length, [], 'equal', 2);
AntSecreteTest.createTest(MAP[coordToIndex({x : 25, y : 25})].pheromone[1].concentration, [], 'equal', 0.5);
AntSecreteTest.createTest(MAP[coordToIndex({x : 25, y : 25})].pheromone[0].concentration, [], 'equal', 0.4);

createMap();
// Simulate the dummy pheromone
MAP[coordToIndex({x : 25, y : 25})].pheromone = [{species : testAntSpecies, concentration : 0.8}];
testAnt.secrete();
AntSecreteTest.createTest(MAP[coordToIndex({x : 25, y : 25})].pheromone.length, [], 'equal', 1);
AntSecreteTest.createTest(MAP[coordToIndex({x : 25, y : 25})].pheromone[0].concentration, [], 'equal', 1);

AntSecreteTest.summery();