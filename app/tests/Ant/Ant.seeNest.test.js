// ---------- Ant.seeNest ----------

/**
* Test case - Test that can see nest when in range
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*	CELL_SIZE = {width : 10, height : 10};
*	GRID_SIZE = {width : 50, height : 50};
*	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*	A single ant in a static position with a single nest
*
* Test data - Cannot see the nest [functional value]
* Expected  - returns false
*
* Test data - An ant within the ants view [functional value]
* Expected  - returns true
*/

var AntSeeNestTest = new testCase('Test that can see nest when in range');

var testAntSpecies = {chars : {eyesight : 10, eyeAngle : Math.PI/2}, itemsInView : {ants : [], food : []}};	// simulate a species
var testAntNest = {type : ANT_TYPE.nest, nest : 0};	// simulate a nest
var testAnt = new Ant(1, {x : 25, y : 25});
testAnt.species = testAntSpecies;
testAnt.direction = 3.67;
testAnt.nest = 0;

AntSeeNestTest.callwith = testAnt;
AntSeeNestTest.autorun = true;

MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
CELL_SIZE = {width : 10, height : 10};
GRID_SIZE = {width : 50, height : 50};
NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;

createMap();

// Simulate the dummy ants
MAP[coordToIndex({x : 5, y : 2})].ant = [testAntNest];

testAnt.scan();

AntSeeNestTest.createTest(testAnt.seeNest, [], 'equal', false);

createMap();

// Simulate the dummy ants
MAP[coordToIndex({x : 23, y : 26})].ant = [testAntNest];

testAnt.scan();

AntSeeNestTest.createTest(testAnt.seeNest, [], 'equal', true);

AntSeeNestTest.summery();