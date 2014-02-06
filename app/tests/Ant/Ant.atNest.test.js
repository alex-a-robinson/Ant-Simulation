// ---------- Ant.atNest ----------

/**
* Test case - Test that ant is on nest or not
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*	CELL_SIZE = {width : 10, height : 10};
*	GRID_SIZE = {width : 50, height : 50};
*	NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*	A single ant in a static position with a single nest
*
* Test data - not on the nest [functional value]
* Expected  - returns false
*
* Test data - On the nest [functional value]
* Expected  - returns true
*/

var AntAtNestTest = new testCase('Test that ant is on nest or not');

var testAntSpecies = {chars : {eyesight : 10, eyeAngle : Math.PI/2}, itemsInView : {ants : [], food : []}};	// simulate a species
var testAntNest = {type : ANT_TYPE.nest, nest : 0};	// simulate a nest
var testAnt = new Ant(1, {x : 25, y : 25});
testAnt.species = testAntSpecies;
testAnt.direction = 3.67;
testAnt.nest = 0;

AntAtNestTest.callwith = testAnt;
AntAtNestTest.autorun = true;

MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
CELL_SIZE = {width : 10, height : 10};
GRID_SIZE = {width : 50, height : 50};
NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;

createMap();

// Simulate the dummy nest
MAP[coordToIndex({x : 5, y : 2})].ant = [testAntNest];

AntAtNestTest.createTest(testAnt.atNest, [], 'equal', false);

createMap();

// Simulate the dummy ants
MAP[coordToIndex({x : 25, y : 25})].ant = [testAntNest];

AntAtNestTest.createTest(testAnt.atNest, [], 'equal', true);

AntAtNestTest.summery();