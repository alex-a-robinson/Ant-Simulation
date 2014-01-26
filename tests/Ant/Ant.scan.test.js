// ---------- Ant.scan ----------

/**
* Test case - Test that adds all ants within viewing distance to ant.itemsInView.ants
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*        CELL_SIZE = {width : 50, height : 50};
*        GRID_SIZE = {width : 10, height : 10};
*        NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*        A single ant in a static position with multiple ants around it
*
* Test data - No ants in view [edge case]
* Expected  - this.itemsInView.ants.length = 0 i.e. cannot see any ants in view
*
* Test data - Multiple ants within viewing distance [functional value]
* Expected  - this.itemsInView.ants.length = 4
*/

var AntScanVisibleAntsTest = new testCase('Test that adds all ants within viewing distance to ant.itemsInView.ants');

var testAntSpecies = {chars : {eyesight : 10, eyeAngle : Math.PI/2}};        // simulate a species
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
*        CELL_SIZE = {width : 50, height : 50};
*        GRID_SIZE = {width : 10, height : 10};
*        NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*        A single ant in a static position with multiple pieces of food around it
*
* Test data - No food in view [edge case]
* Expected  - this.itemsInView.food.length = 0 i.e. cannot see any food in view
*/

var AntScanVisibleAntsTest = new testCase('Test that adds all food within viewing distance to ant.itemsInView.food');

var testAntSpecies = {chars : {eyesight : 10, eyeAngle : Math.PI/2}};        // simulate a species
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